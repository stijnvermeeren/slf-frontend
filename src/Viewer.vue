<template>
    <div>
        <div v-if="comparisonActive">
            <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
        </div>
        <div v-else>
            <img :src="imageUrl" alt="Image" />
        </div>

        <div>
            <ui-radio-group name="category" :options="categories" v-model="category">Map data</ui-radio-group>
            <div>
                <div class="year">
                    <ui-select name="year" :options="reverseYears" v-model="year">Year</ui-select>
                </div>
                <div class="date">
                    <ui-select name="date" :options="availableDates" v-model="date">Date</ui-select>
                </div>
            </div>
            <div>
                <DatesSlider v-model="date" :availableDates="availableDates"></DatesSlider>
                {{date}}
            </div>
            <ui-checkbox v-model="comparisonActive">Compare with other image</ui-checkbox>
            <div v-if="comparisonActive">
                <div class="year">
                    <ui-select name="compareYear" :options="reverseYears" v-model="compareYear">Year</ui-select>
                </div>
                <div class="date">
                    <ui-select name="compareDate" :options="availableCompareDates" v-model="compareDate">Date</ui-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dates from './dates';
    import ImageComparison from './ImageComparison.vue';
    import DatesSlider from './DatesSlider.vue';

    export default {
      props: ['initialYear', 'initialCategory', 'initialDate'],
      data() {
        return {
          comparisonActive: false,
          year: this.initialYear,
          category: this.initialCategory,
          date: this.initialDate,
          compareYear: this.initialYear,
          compareDate: this.initialDate,
          categories: [
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
            },
            {
              'value': '1day',
              'label': 'New snow 1 day'
            },
            {
              'value': '3days',
              'label': 'New snow 3 days'
            }
          ]
        }
      },
      computed: {
        imageUrl() {
          return this.$store.getters.imageUrl(this.year, this.category, this.date);
        },
        compareImageUrl() {
          return this.$store.getters.imageUrl(this.compareYear, this.category, this.compareDate);
        },
        reverseYears() {
          return this.$store.getters.years.reverse()
        },
        availableDates() {
          return this.$store.getters.availableDates(this.year, this.category)
        },
        availableCompareDates() {
          return this.$store.getters.availableDates(this.compareYear, this.category)
        }
      },
      watch: {
        year: function() {
          this.checkDate();
        },
        category: function() {
          this.checkDate();
        },
        date: function() {
          this.checkCompareDate();
        },
        compareYear: function() {
          this.checkCompareDate();
        }
      },
      methods: {
        checkDate() {
          this.date = dates.findClosest(this.date, this.availableDates);
        },
        checkCompareDate() {
          this.compareDate = dates.findClosest(this.date, this.availableCompareDates);
        }
      },
      components: {
        ImageComparison,
        DatesSlider
      }
    }
</script>

<style lang="scss">
    img {
        width: 800px;
    }

    div.year {
        width: 100px;
        display: inline-block;
    }
    div.date {
        margin-left: 40px;
        width: 650px;
        display: inline-block;
    }
</style>