<template>
    <div>
        <div>
            <CustomSlider v-model="dateValue" :minValue="minValue" :maxValue="maxValue" :steps="steps" snapToSteps></CustomSlider>
        </div>
        <div class="months">
            <span :style="monthStyle(10)">Oct</span><span :style="monthStyle(11)">Nov</span><span :style="monthStyle(12)">Dec</span><span :style="monthStyle(1)">Jan</span><span :style="monthStyle(2)">Feb</span><span :style="monthStyle(3)">Mar</span><span :style="monthStyle(4)">Apr</span><span :style="monthStyle(5)">May</span><span :style="monthStyle(6)">Jun</span>
        </div>
    </div>
</template>

<script>
    import CustomSlider from './CustomSlider.vue';
    import dates from './dates';

    let moment = require('moment');

    export default {
      props: ['value', 'year', 'availableDates'],
      data() {
        return {
          dateValue: dates.dateToInt(this.value)
        }
      },
      computed: {
        minValue() {
          return dates.dateToInt((this.year - 1) + '-10-01');
        },
        maxValue() {
          return dates.dateToInt(this.year + '-06-30');
        },
        steps() {
          return this.availableDates.map(dates.dateToInt);
        }
      },
      watch: {
        value(newValue) {
          this.dateValue = dates.dateToInt(newValue);
        },
        dateValue(newValue) {
          const date = dates.intToDate(newValue);
          if (this.availableDates.includes(date)) {
            this.$emit('input', date);
          }
        }
      },
      methods: {
        monthStyle(month) {
          const year = (month <= 6) ? this.year : this.year - 1;
          const daysInMonth = moment(year + '-' + month, 'YYYY-MM').daysInMonth();
          const percentage = daysInMonth / (this.maxValue - this.minValue);
          return {
            width: (100 * percentage - 0.05) + '%'
          };
        }
      },
      components: {
        CustomSlider
      }
    }
</script>

<style lang="scss">
    div.months {
        span {
            text-align: center;
            display: inline-block;
            padding: 0;
            margin: 0;
        }
        span:nth-child(even) {
            background: #2196f3;
        }
        span:nth-child(odd) {
            background: #7FACBB;
        }
    }
</style>