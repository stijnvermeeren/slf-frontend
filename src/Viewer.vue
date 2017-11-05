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
            <div class="controls">
                <div class="controlsRow">
                    <div class="year">
                        <ui-select name="year" :options="yearsOptions" v-model="yearOption">Year</ui-select>
                    </div>
                    <div class="date">
                        <ui-select name="date" :options="availableDates" v-model="date">Date</ui-select>
                    </div>
                    <div class="dateSlider">
                        <DatesSlider v-model="date" :year="year" :availableDates="availableDates"></DatesSlider>
                    </div>
                </div>
            </div>
            <ui-checkbox v-model="comparisonActive">Compare with other image</ui-checkbox>
            <div v-if="comparisonActive" class="controls">
                <div class="controlsRow">
                    <div class="year">
                        <ui-select name="compareYear" :options="yearsOptions" v-model="compareYearOption">Year</ui-select>
                    </div>
                    <div class="date">
                        <ui-select name="compareDate" :options="availableCompareDates" v-model="compareDate">Date</ui-select>
                    </div>
                    <div class="dateSlider">
                        <DatesSlider v-model="compareDate" :year="compareYear" :availableDates="availableCompareDates"></DatesSlider>
                    </div>
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
          yearOption: {
            value: this.initialYear,
            label: '' + this.initialYear
          },
          category: this.initialCategory,
          date: this.initialDate,
          compareYearOption: {
            value: this.initialYear,
            label: '' + this.initialYear
          },
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
        year() {
          return this.yearOption.value;
        },
        compareYear() {
          return this.compareYearOption.value;
        },
        imageUrl() {
          return this.$store.getters.imageUrl(this.year, this.category, this.date);
        },
        compareImageUrl() {
          return this.$store.getters.imageUrl(this.compareYear, this.category, this.compareDate);
        },
        yearsOptions() {
          return this.$store.getters.years.map(year => {
            return {
              label: '' + year,
              value: year
            }
          }).reverse();
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

    div.controls {
        display: table;
        width: 100%;
    }
    div.controlsRow {
        display: table-row;
    }
    div.year {
        width: 60px;
        display: table-cell;
    }
    div.date {
        width: 110px;
        padding-left: 10px;
        display: table-cell;
    }
    div.dateSlider {
        padding-left: 10px;
        width: 450px;
        display: table-cell;
    }
</style>