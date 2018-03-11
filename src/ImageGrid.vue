<template>
    <div>
        <div class="grid">
            <div
                    v-for="gridDate in gridDates"
                    :class="{ selected: isSelectedDate(gridDate) }"
            >
                {{dateFullFormat(gridDate)}}
            </div>

            <template v-for="category in categories">
                <div class="label">{{category.label}}</div>
                <div v-for="gridDate in gridDates">
                    <img v-for="fileName in fileNames(category.value, gridDate)"
                         @click="clickImage(category.value, gridDate, fileName)"
                         :src="thumbUrl(category.value, gridDate, fileName)"
                         :alt="category.label" />
                </div>
            </template>
        </div>

        <ViewerModal v-if="showModal" :category="modalCategory" :date="modalDate" :fileName="modalFileName" @close="showModal = false"></ViewerModal>
    </div>
</template>

<script>
  import dates from './dates';
  import ViewerModal from './ViewerModal.vue';

  export default {
    components: {
      ViewerModal
    },
    props: ['date'],
    data() {
      return {
        modalCategory: undefined,
        modalDate: undefined,
        modalFileName: undefined,
        showModal: false
      }
    },
    computed: {
      gridDates() {
        function addDays(date, offset) {
          const newDate = new Date(date);
          newDate.setDate(date.getDate() + offset);
          return newDate;
        }

        const now = new Date;
        const threeDaysAgo = addDays(now, -3);

        if (this.date < threeDaysAgo) {
          // seven days centered around this.date
          const offsets = [-3, -2, -1, 0, 1, 2, 3];
          return offsets.map(offset => addDays(this.date, offset))
        } else {
          // seven days up to today
          const offsets = [-6, -5, -4, -3, -2, -1, 0];
          return offsets.map(offset => addDays(now, offset))
        }
      },
      categories() {
        return [
          {
            'value': 'risk',
            'label': 'Avalanche risk levels'
          },
          {
            'value': '1day',
            'label': 'New snow 1 day'
          },
          {
            'value': '3days',
            'label': 'New snow 3 days'
          },
          {
            'value': 'depth',
            'label': 'Depth'
          },
          {
            'value': 'at2000m',
            'label': 'Depth at 2000m/2500m'
          },
          {
            'value': 'relative',
            'label': 'Depth %'
          }
        ];
      }
    },
    methods: {
      dateFullFormat(date) {
        return dates.fullFormat(date);
      },
      thumbUrl(category, date, fileName) {
        return this.$store.getters.imageUrl(category, 'thumb', fileName);
      },
      fileNames(category, date) {
        return this.$store.getters.fileNames(category, dates.dateToIso(date));
      },
      clickImage(category, date, fileName) {
        this.modalCategory = category;
        this.modalDate = date;
        this.modalFileName = fileName;
        this.showModal = true;
      },
      isSelectedDate(date) {
        return dates.equals(date, this.date);
      }
    }
  }
</script>

<style lang="scss" scoped>
    div.grid {
        display: grid;
        grid-template-columns: [start] 1fr 1fr 1fr 1fr 1fr 1fr 1fr [end];
        text-align: center;
        margin-top: 20px;

        div.selected {
            font-weight: bold;
        }

        div.label {
            grid-column-start: start;
            grid-column-end: end;

            text-align: left;
            font-size: 75%;
            margin-top: 10px;
        }

        img {
            cursor: pointer;
            width: 100px;
        }
    }

    div.date {
        text-align: center;
        font-size: 90%;
        margin-bottom: 10px;
        font-weight: bold;
    }
</style>
