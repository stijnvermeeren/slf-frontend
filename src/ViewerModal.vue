<template>
    <div class="overlay" @mousedown="$emit('close')">
        <div class="modal" @mousedown.stop>
            <ui-button @click="$emit('close')" iconPosition="right" icon="clear">Close</ui-button>

            <h2>{{fullDateString}}</h2>

            <div class="imageContainer">
                <div v-if="comparisonEnabled && comparisonActive">
                    <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
                </div>
                <div v-else>
                    <img :src="imageUrl" alt="Image" />
                </div>
            </div>

            <div v-if="comparisonEnabled" class="dateSelect">
                <ui-switch v-model="comparisonActive">Compare with a different date</ui-switch>
                <div v-if="comparisonActive">
                    <ui-datepicker v-model="compareDate" :max-date="new Date()" :dateFilter="isDateAvailable">
                        Pick comparison date
                    </ui-datepicker>
                    <div class="hint">Click on the map to adjust the comparison</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import dates from './dates';
  import ImageComparison from './ImageComparison.vue';

  export default {
    components: {
      ImageComparison
    },
    props: ['date', 'category', 'fileName'],
    data() {
      return {
        comparisonActive: false,
        compareDate: this.defaultCompareDate()
      }
    },
    computed: {
      comparisonEnabled() {
        return this.category !== 'risk';
      },
      fullDateString() {
        return dates.fullFormat(this.date);
      },
      availableIsoDateStrings() {
        return new Set(this.$store.getters.availableIsoDateStrings(this.category));
      },
      imageUrl() {
        return this.$store.getters.imageUrl(this.category, 'optimised', this.fileName);
      },
      compareImageUrl() {
        return this.$store.getters.compareImageUrl(this.category, dates.dateToIso(this.compareDate));
      }
    },
    methods: {
      defaultCompareDate() {
        const lastDate = this.$store.getters.availableIsoDateStrings(this.category).pop();
        return lastDate ? new Date(lastDate) : new Date();
      },
      isDateAvailable(date) {
        return this.availableIsoDateStrings.has(dates.dateToIso(date))
      }
    }
  }
</script>

<style lang="scss" scoped>
    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 2;
        cursor: pointer;

        .modal {
            position: relative;
            margin: auto auto;
            width: 820px;
            height: 820px;
            padding: 10px;
            background-color: white;
            cursor: auto;

            .ui-button {
                position: absolute;
                top: 10px;
                right: 10px;
            }
        }
    }

    div.imageContainer {
        min-height: 570px;
        img {
            width: 800px;
        }
    }

    div.dateSelect {
        .hint {
            margin-top: 10px;
            color: rgba(0, 0, 0, 0.54)
        }
    }
</style>
