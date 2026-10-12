<template>
    <div class="overlay" @mousedown="$emit('close')">
        <div class="modal" @mousedown.stop>
            <button class="close-btn" @click="$emit('close')">✕ Close</button>

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
                <label class="comparison-toggle">
                    <input type="checkbox" v-model="comparisonActive" />
                    Compare with a different date
                </label>
                <div v-if="comparisonActive">
                    <label class="date-label">
                        Pick comparison date
                        <input type="date" :value="compareDateString" @change="onCompareDateChange" :max="maxDateString" />
                    </label>
                    <div class="hint">Drag the slider to adjust the comparison</div>
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
      },
      compareDateString() {
        return dates.dateToIso(this.compareDate);
      },
      maxDateString() {
        return dates.dateToIso(new Date());
      }
    },
    methods: {
      defaultCompareDate() {
        // Can't use computed property here, since we are calling this method in data() where computed properties
        // have not been initialised.
        const lastDate = this.$store.getters.availableIsoDateStrings(this.category).pop();
        return lastDate ? new Date(lastDate) : new Date();
      },
      onCompareDateChange(e) {
        const value = e.target.value;
        if (value) {
          this.compareDate = new Date(value + 'T12:00:00');
        }
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

        .comparison-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            cursor: pointer;
        }

        .date-label {
            display: block;
            font-size: 14px;
            margin-top: 8px;
        }

        input[type="date"] {
            font-size: 14px;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 2px;
            margin-left: 6px;
        }

        .hint {
            margin-top: 10px;
            color: rgba(0, 0, 0, 0.54)
        }
    }
</style>
