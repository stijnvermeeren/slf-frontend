<template>
    <div>
        <CustomSlider v-model="dateValue" :minValue="minValue" :maxValue="maxValue"></CustomSlider>
        <p>{{dateValue}}, {{value}}, {{minValue}} {{maxValue}}</p>
    </div>
</template>

<script>
    import CustomSlider from './CustomSlider.vue';
    import dates from './dates';

    export default {
      props: ['value', 'availableDates'],
      data() {
        return {
          dateValue: dates.dateToInt(this.value)
        }
      },
      computed: {
        minValue() {
          return Math.min(...this.availableDates.map(dates.dateToInt));
        },
        maxValue() {
          return Math.max(...this.availableDates.map(dates.dateToInt));
        },
      },
      watch: {
        dateValue(newValue) {
          this.$emit('input', dates.intToDate(newValue));
        },
        value(newValue) {
          this.dateValue = dates.dateToInt(newValue);
        }
      },
      components: {
        CustomSlider
      }
    }
</script>