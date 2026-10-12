<template>
    <div>
        <div>
            <div>
                <label class="date-label">
                    Pick date
                    <input type="date" v-model="dateString" :max="maxDateString" />
                </label>
                <div class="date-buttons">
                    <button @click="date = addYears(-1)">-1 year</button>
                    <button @click="date = addDays(-7)">-1 week</button>
                    <button @click="date = addDays(-1)">-1 day</button>

                    <button @click="date = addDays(1)" :disabled="todaySelected">+1 day</button>
                    <button @click="date = addDays(7)" :disabled="todaySelected">+1 week</button>
                    <button @click="date = addYears(1)" :disabled="todaySelected">+1 year</button>
                </div>
            </div>
        </div>
        <ImageGrid :date="date" class="categorySelect" />
    </div>
</template>

<script>
    import dates from './dates';
    import ImageGrid from './ImageGrid.vue';

    export default {
      components: {
        ImageGrid
      },
      props: ['initialDate'],
      data() {
        return {
          date: this.initialDate
        }
      },
      computed: {
        todaySelected() {
          return dates.equals(this.date, new Date());
        },
        dateString: {
          get() {
            return dates.dateToIso(this.date);
          },
          set(value) {
            if (value) {
              this.date = new Date(value + 'T12:00:00');
            }
          }
        },
        maxDateString() {
          return dates.dateToIso(new Date());
        }
      },
      methods: {
        addDays(offset) {
          const now = new Date();
          const newDate = new Date(this.date);
          newDate.setDate(newDate.getDate() + offset);
          return newDate > now ? now : newDate;
        },
        addYears(offset) {
          const now = new Date();
          const newDate = new Date(this.date);
          newDate.setFullYear(newDate.getFullYear() + offset);
          return newDate > now ? now : newDate;
        }
      }
    }
</script>

<style lang="scss" scoped>
    input[type="date"] {
        font-size: 14px;
        padding: 6px 8px;
        border: 1px solid #ccc;
        border-radius: 2px;
    }

    .date-label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
    }

    .date-buttons {
        margin-top: 8px;
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
    }

    button {
        padding: 4px 10px;
        font-size: 13px;
        cursor: pointer;
        border: 1px solid #bdbdbd;
        border-radius: 2px;
        background: #fff;

        &:hover:not(:disabled) {
            background: #f5f5f5;
        }

        &:disabled {
            opacity: 0.5;
            cursor: default;
        }
    }

    div.categorySelect {
        clear: both;
    }
</style>
