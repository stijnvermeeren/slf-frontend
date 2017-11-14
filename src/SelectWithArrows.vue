<template>
    <div>
        <ui-icon-button
                icon="chevron_left"
                size="small"
                ariaLabel="previous"
                :disabled="nextValue === undefined"
                @click="innerValue = nextValue" />
        <ui-select :name="name" :options="options" v-model="innerValue"><slot /></ui-select>
        <ui-icon-button
                icon="chevron_right"
                size="small"
                ariaLabel="next"
                :disabled="previousValue === undefined"
                @click="innerValue = previousValue" />
    </div>
</template>

<script>
    export default {
      props: ['options', 'value', 'name'],
      data() {
        return {
          innerValue: this.value
        }
      },
      computed: {
        currentIndex() {
          return this.options.findIndex(item => {
            if (typeof(item) === 'string')
                return item === this.value;
            else {
                return item.value === this.value.value;
            }
          });
        },
        previousValue() {
          if (this.currentIndex > 0) {
            return this.options[this.currentIndex - 1];
          }
        },
        nextValue() {
          if (this.currentIndex < this.options.length - 1) {
            return this.options[this.currentIndex + 1]
          }
        }
      },
      watch: {
        innerValue(newValue) {
          this.$emit('input', newValue);
        },
        value(newValue) {
          this.innerValue = newValue;
        }
      }
    }
</script>

<style lang="scss" scoped>
    div {
        display: inline-block;
        text-align: left;
    }

    div.ui-select {
        margin: 0 10px;
    }

    * {
        box-sizing: content-box;
    }
</style>