<template>
    <div>
        <div v-if="comparisonActive">
            <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
        </div>
        <div v-else class="imageContainer">
            <img :src="imageUrl" alt="Image" />
        </div>

        <div class="dateSelect left">
            <div class="controls">
                <div class="year">
                    <SelectWithArrows name="year" :options="yearsOptions" v-model="yearOption">Year</SelectWithArrows>
                </div>
                <div class="date">
                    <SelectWithArrows name="date" :options="availableDates" v-model="dateOption">Date</SelectWithArrows>
                </div>
            </div>
        </div>
        <div class="dateSelect right">
            <ui-switch v-model="comparisonActive">Compare with a different date</ui-switch>
            <div v-if="comparisonActive">
                <div class="controls">
                    <div class="year">
                        <SelectWithArrows name="compareYear" :options="yearsOptions" v-model="compareYearOption">Year</SelectWithArrows>
                    </div>
                    <div class="date">
                        <SelectWithArrows name="compareDate" :options="availableCompareDates" v-model="compareDateOption">Date</SelectWithArrows>
                    </div>
                </div>
                <div class="hint">Click on the map to adjust the comparison</div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="dataSelect">
            <ui-radio-group name="category" :options="categories" v-model="category">Map data</ui-radio-group>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import dates from './dates';
    import ImageComparison from './ImageComparison.vue';
    import SelectWithArrows from './SelectWithArrows.vue';

    export default {
      props: ['initialYear', 'initialCategory', 'initialDate'],
      data() {
        return {
          onLatestDate: true,
          comparisonActive: false,
          yearOption: this.yearToOption(this.initialYear),
          category: this.initialCategory,
          dateOption: this.dateStringToOption(this.initialDate),
          compareYearOption: this.yearToOption(this.initialYear),
          compareDateOption: this.dateStringToOption(this.initialDate)
        }
      },
      computed: {
        year() {
          return this.yearOption.value;
        },
        compareYear() {
          return this.compareYearOption.value;
        },
        date() {
          return this.dateOption ? this.dateOption.value : undefined;
        },
        compareDate() {
          return this.compareDateOption ? this.compareDateOption.value : undefined;
        },
        imageUrl() {
          return this.$store.getters.imageUrl(this.year, this.category, this.date);
        },
        compareImageUrl() {
          return this.$store.getters.imageUrl(this.compareYear, this.category, this.compareDate);
        },
        yearsOptions() {
          return this.$store.getters.years.map(this.yearToOption).reverse();
        },
        availableDates() {
          return [...this.$store.getters.availableDates(this.year, this.category)]
            .reverse()
            .map(this.dateStringToOption);
        },
        availableCompareDates() {
          return [...this.$store.getters.availableDates(this.compareYear, this.category)]
            .reverse()
            .map(this.dateStringToOption);
        },
        categories() {
          return [
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
          ];
        }
      },
      watch: {
        year: function() {
          this.checkDate();
        },
        category: function() {
          if (this.onLatestDate) {
            this.date = this.availableDates[0];
          }
          this.checkDate();
        },
        date: function() {
          this.onLatestDate = (this.year === this.initialYear && this.date === this.availableDates[0]);
          this.checkCompareDate();
        },
        compareYear: function() {
          this.checkCompareDate();
        }
      },
      methods: {
        yearToOption(year) {
          return {
            label: String(year - 1) + " - '" + String(year % 100).padStart(2, '0'),
            value: year
          }
        },
        dateStringToOption(dateString) {
          return {
            label: dates.fullFormat(moment(dateString)),
            value: dateString
          }
        },
        checkDate() {
          if (this.date) {
            this.dateOption = dates.findClosest(this.date, this.availableDates);
          } else if (this.availableDates.length > 0) {
            this.dateOption = this.availableDates[0];
          }
        },
        checkCompareDate() {
          if (this.date) {
            this.compareDateOption = dates.findClosest(this.date, this.availableCompareDates);
          } else if (this.compareDate) {
            this.compareDateOption = dates.findClosest(this.compareDate, this.availableCompareDates);
          } else if (this.availableCompareDates.length > 0) {
            this.compareDateOption = this.availableCompareDates[0];
          }
        }
      },
      components: {
        ImageComparison,
        SelectWithArrows
      }
    }
</script>

<style lang="scss" scoped>
    div.imageContainer {
        min-height: 565px;
        img {
            width: 800px;
        }
    }

    .hint {
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.54)
    }

    div.dataSelect {
        margin-top: 20px;
    }

    div.dateSelect {
        margin-top: 20px;
        width: 380px;
        &.right {
            float: right;
        }
        &.left {
            float: left;
        }

        div.controls {
            width: 100%;
            margin-bottom: 10px;

            div.year, div.date {
                text-align: center;
            }
        }
    }
    div.clear {
        clear: both;
    }
</style>