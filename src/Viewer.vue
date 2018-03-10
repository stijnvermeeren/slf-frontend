<template>
    <div>
        <div>
            <div>
                <ui-datepicker v-model="date" :max-date="new Date()">
                    Pick date
                </ui-datepicker>
                <div>
                    <ui-button @click="date = addYears(-1)" size="small">-1 year</ui-button>
                    <ui-button @click="date = addDays(-7)" size="small">-1 week</ui-button>
                    <ui-button @click="date = addDays(-1)" size="small">-1 day</ui-button>

                    <ui-button @click="date = addDays(1)" :disabled="todaySelected" size="small">+1 day</ui-button>
                    <ui-button @click="date = addDays(7)" :disabled="todaySelected" size="small">+1 week</ui-button>
                    <ui-button @click="date = addYears(1)" :disabled="todaySelected" size="small">+1 year</ui-button>
                </div>
            </div>
        </div>
        <ImageGrid :date="date" class="categorySelect" />
    </div>
</template>

<script>
    import moment from 'moment';
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
    .ui-datepicker {
        max-width: 268px;
    }

    div.categorySelect {
        clear: both;
    }
</style>
