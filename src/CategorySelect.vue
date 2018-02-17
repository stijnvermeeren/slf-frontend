<template>
    <div>
        <div
                v-for="category in categories"
                :class="['category', {selected: category.value === value}]"
                @click="$emit('input', category.value)"
        >
            <img :src="imageUrl(category.value)" :alt="category.label" />
            <div class="label">{{category.label}}</div>
        </div>
    </div>
</template>

<script>
  import dates from './dates';

  export default {
    props: ['value', 'date', 'year'],
    computed: {
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
    div.category {
        text-align: center;
        margin-bottom: 12px;

        img {
            width: 120px;
        }
        div.label {
            font-size: 70%;
        }

        &.selected {
            div.label {
                font-weight: bold;
            }
        }

        &:not(.selected) {
            cursor: pointer;
        }
    }
</style>
