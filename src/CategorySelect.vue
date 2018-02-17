<template>
    <div>
        <div class="current">
            <div class="label">
                <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation.html#schneedeckewetter">
                    Current avalanche bulletin on slf.ch
                </a>
            </div>
            <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation.html#lawinengefahr">
                <img src="http://www.slf.ch/avalanche/bki/bki_de_c_teaser.gif" alt="Current avalanche forecast from slf.ch" />
            </a>
        </div>
        <div class="date">{{dateFullFormat}}</div>
        <div class="categories">
            <div
                    v-for="category in categories"
                    :class="['category', {selected: category.value === value}]"
                    @click="$emit('input', category.value)"
            >
                <img :src="imageUrl(category.value)" :alt="category.label" />
                <div class="label">{{category.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>
  import dates from './dates';

  export default {
    props: ['value', 'date', 'year'],
    computed: {
      dateFullFormat() {
        return dates.fullFormat(this.date);
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
    methods: {
      imageUrl(category) {
        return this.$store.getters.imageUrl(this.year, category, 'thumb', this.nearestDate(category));
      },
      nearestDate(category) {
        const availableDates = this.$store.getters.availableDates(this.year, category);
        return dates.findClosest(this.date, availableDates);
      }
    }
  }
</script>

<style lang="scss" scoped>
    div.current {
        margin-top: 6px;
        margin-bottom: 36px;
        padding-top: 8px;

        background-color: rgba(33, 150, 243, .3);
        border-radius: 5px;

        text-align: center;

        div.label {
            font-weight: bold;
            font-size: 70%;
        }
        img {
            width: 160px;
        }
    }

    div.date {
        text-align: center;
        font-size: 90%;
        margin-bottom: 10px;
        font-weight: bold;
    }

    div.categories {
        display: grid;
        grid-template-columns: 100px 100px;
        grid-template-rows: 120px 120px 120px;

        div.category {
            text-align: center;
            margin-bottom: 12px;

            img {
                width: 100px;
            }
            div.label {
                font-size: 70%;
            }

            &.selected {
                div.label {
                    background-color: rgba(33, 150, 243, .3);
                    border-radius: 5px;
                    font-weight: bold;
                }
            }

            &:not(.selected) {
                cursor: pointer;
            }
        }
    }
</style>
