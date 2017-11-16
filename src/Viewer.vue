<template>
    <div>
        <div v-if="comparisonActive">
            <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
        </div>
        <div v-else class="imageContainer">
            <img :src="imageUrl" alt="Image" />
        </div>

        <div class="segment">
            <ui-radio-group name="category" :options="categories" v-model="category">Map data</ui-radio-group>
        </div>
        <div class="segment">
            <div class="controls">
                <div class="controlsRow">
                    <div class="year">
                        <SelectWithArrows name="year" :options="yearsOptions" v-model="yearOption">Year</SelectWithArrows>
                    </div>
                    <div class="date">
                        <SelectWithArrows name="date" :options="availableDates" v-model="date">Date</SelectWithArrows>
                    </div>
                </div>
            </div>
            <div class="dateSlider">
                <DatesSlider v-model="date" :year="year" :availableDates="availableDates"></DatesSlider>
            </div>
        </div>
        <div class="segment">
            <ui-switch v-model="comparisonActive">Compare with a different date <span v-if="comparisonActive" class="hint">(click on the map to adjust the comparison)</span></ui-switch>
            <div v-if="comparisonActive">
                <div class="controls">
                    <div class="controlsRow">
                        <div class="year">
                            <SelectWithArrows name="compareYear" :options="yearsOptions" v-model="compareYearOption">Year</SelectWithArrows>
                        </div>
                        <div class="date">
                            <SelectWithArrows name="compareDate" :options="availableCompareDates" v-model="compareDate">Date</SelectWithArrows>
                        </div>
                    </div>
                </div>
                <div class="dateSlider">
                    <DatesSlider v-model="compareDate" :year="compareYear" :availableDates="availableCompareDates"></DatesSlider>
                </div>
                <div class="hint">Comparison date will stay in sync when changing the main date</div>
            </div>
        </div>
    </div>
</template>

<script>
    import dates from './dates';
    import DatesSlider from './DatesSlider.vue';
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
          date: this.initialDate,
          compareYearOption: this.yearToOption(this.initialYear),
          compareDate: this.initialDate
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
          return this.$store.getters.years.map(this.yearToOption).reverse();
        },
        availableDates() {
          return [...this.$store.getters.availableDates(this.year, this.category)].reverse();
        },
        availableCompareDates() {
          return [...this.$store.getters.availableDates(this.compareYear, this.category)].reverse();
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
        checkDate() {
          this.date = dates.findClosest(this.date, this.availableDates);
        },
        checkCompareDate() {
          this.compareDate = dates.findClosest(this.date, this.availableCompareDates);
        }
      },
      components: {
        ImageComparison,
        SelectWithArrows,
        DatesSlider
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

    div.segment {
        margin-top: 20px;

        div.controls {
            display: table;
            width: 100%;
            margin-bottom: 10px;

            div.controlsRow {
                display: table-row;

                div.year, div.date {
                    display: table-cell;
                    text-align: center;
                }
            }
        }
    }
</style>