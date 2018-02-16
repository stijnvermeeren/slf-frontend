<template>
    <div class="grid">
        <CategorySelect v-model="category" :year="year" :date="date" />

        <div>
            <div class="imageContainer">
                <div v-if="comparisonActive">
                    <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
                </div>
                <div v-else>
                    <img :src="imageUrl" alt="Image" />
                </div>
            </div>

            <div class="dateSelect left">
                <div class="leftHeader">Select a date for the map</div>
                <div class="controls">
                    <div class="year">
                        <SelectWithArrows
                                name="year"
                                :options="yearsOptions"
                                :value="yearToOption(year)"
                                @input="newOption => year = newOption.value"
                        >Year</SelectWithArrows>
                    </div>
                    <div class="date">
                        <SelectWithArrows
                                name="date"
                                :options="availableDateOptions"
                                :value="dateStringToOption(date)"
                                @input="newOption => date = newOption.value"
                        >Date</SelectWithArrows>
                    </div>
                </div>
            </div>
            <div class="dateSelect right">
                <ui-switch v-model="comparisonActive">Compare with a different date</ui-switch>
                <div>
                    <div class="controls">
                        <div class="year">
                            <SelectWithArrows
                                    name="compareYear"
                                    :options="yearsOptions"
                                    :value="yearToOption(compareYear)"
                                    @input="newOption => compareYear = newOption.value"
                                    :disabled="!comparisonActive"
                            >Year</SelectWithArrows>
                        </div>
                        <div class="date">
                            <SelectWithArrows
                                    name="compareDate"
                                    :options="availableCompareDateOptions"
                                    :value="dateStringToOption(compareDate)"
                                    @input="newOption => compareDate = newOption.value"
                                    :disabled="!comparisonActive"
                            >Date</SelectWithArrows>
                        </div>
                    </div>
                    <div class="hint">Click on the map to adjust the comparison</div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import dates from './dates';
    import ImageComparison from './ImageComparison.vue';
    import SelectWithArrows from './SelectWithArrows.vue';
    import CategorySelect from './CategorySelect.vue';

    export default {
      props: ['initialYear', 'initialCategory', 'initialDate'],
      data() {
        return {
          onLatestDate: true,
          comparisonActive: false,
          year: this.initialYear,
          category: this.initialCategory,
          date: this.initialDate,
          compareYear: this.initialYear,
          compareDate: this.initialDate
        }
      },
      computed: {
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
            .reverse();
        },
        availableCompareDates() {
          return [...this.$store.getters.availableDates(this.compareYear, this.category)]
            .reverse();
        },
        availableDateOptions() {
          return this.availableDates.map(this.dateStringToOption);
        },
        availableCompareDateOptions() {
          return this.availableCompareDates.map(this.dateStringToOption);
        },
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
            this.date = dates.findClosest(this.date, this.availableDates);
          } else if (this.availableDates.length > 0) {
            this.date = this.availableDates[0];
          }
        },
        checkCompareDate() {
          if (this.date) {
            this.compareDate = dates.findClosest(this.date, this.availableCompareDates);
          } else if (this.compareDate) {
            this.compareDate = dates.findClosest(this.compareDate, this.availableCompareDates);
          } else if (this.availableCompareDates.length > 0) {
            this.compareDate = this.availableCompareDates[0];
          }
        }
      },
      components: {
        ImageComparison,
        SelectWithArrows,
        CategorySelect
      }
    }
</script>

<style lang="scss" scoped>
    div.grid {
        display: grid;
        grid-template-columns: 200px auto;
    }

    div.imageContainer {
        min-height: 570px;
        img {
            width: 800px;
        }
    }

    .hint {
        margin-top: 10px;
        color: rgba(0, 0, 0, 0.54)
    }

    div.dateSelect {
        margin-top: 20px;
        width: 380px;
        &.right {
            float: right;
        }
        &.left {
            div.leftHeader {
                height: 2rem;
                font-size: 0.9375rem;
            }
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
