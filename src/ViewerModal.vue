<template>
    <div class="overlay" @mousedown="$emit('close')">
        <div class="modal" @mousedown.stop>
            <button class="close-btn" @click="$emit('close')">✕ Close</button>

            <h2>{{fullDateString}}</h2>

            <div class="imageContainer">
                <div v-if="comparisonEnabled && comparisonActive && compareDate">
                    <ImageComparison :image="imageUrl" :date="date" :compareImage="compareImageUrl" :compareDate="compareDate"/>
                </div>
                <div v-else>
                    <img :src="imageUrl" alt="Image" />
                </div>
            </div>

            <div v-if="comparisonEnabled" class="dateSelect">
                <ToggleSwitch v-model="comparisonActive">Compare with a different date</ToggleSwitch>
                <div v-if="comparisonActive">
                    <div class="date-label">
                        Pick comparison date
                        <VueDatePicker
                            v-model="compareDate"
                            :disabled-dates="isDateDisabled"
                            :max-date="new Date()"
                            :time-config="{ enableTimePicker: false }"
                            :formats="{ input: 'd MMMM yyyy' }"
                            text-input
                            auto-apply
                        />
                    </div>
                    <div class="hint">Drag the slider to adjust the comparison</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import dates from './dates';
  import ImageComparison from './ImageComparison.vue';
  import ToggleSwitch from './ToggleSwitch.vue';
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';

  export default {
    components: {
      ImageComparison,
      ToggleSwitch,
      VueDatePicker
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
        if (!this.compareDate) return null;
        return this.$store.getters.compareImageUrl(this.category, dates.dateToIso(this.compareDate));
      }
    },
    methods: {
      defaultCompareDate() {
        // Can't use computed property here, since we are calling this method in data() where computed properties
        // have not been initialised.
        const lastDate = this.$store.getters.availableIsoDateStrings(this.category).pop();
        return lastDate ? new Date(lastDate) : new Date();
      },
      isDateDisabled(date) {
        return !this.availableIsoDateStrings.has(dates.dateToIso(date));
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
            max-height: 100vh;
            overflow-y: auto;
            padding: 10px;
            background-color: white;
            cursor: auto;

            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 6px 12px;
                font-size: 13px;
                cursor: pointer;
                border: 1px solid #bdbdbd;
                border-radius: 2px;
                background: #fff;

                &:hover {
                    background: #f5f5f5;
                }
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
        margin-top: 10px;

        .date-label {
            display: block;
            font-size: 14px;
            margin-top: 8px;
            max-width: 268px;
        }

        .hint {
            margin-top: 10px;
            color: rgba(0, 0, 0, 0.54)
        }
    }
</style>
