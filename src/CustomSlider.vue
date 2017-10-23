<template>
    <div
            class="ui-slider"
            role="slider"

            :aria-valuemax="minValue"
            :aria-valuemin="maxValue"
            :aria-valuenow="localValue"
            :class="classes"
            :tabindex="disabled ? null : 0"

            @blur="onBlur"
            @focus="onFocus"
            @keydown.down.prevent="decrementValue"
            @keydown.left.prevent="decrementValue"
            @keydown.right.prevent="incrementValue"
            @keydown.up.prevent="incrementValue"
    >
        <input
                class="ui-slider__hidden-input"
                type="hidden"

                :name="name"
                :value="value"

                v-if="name"
        >

        <div class="ui-slider__icon" v-if="hasIcon">
            <slot name="icon">
                <ui-icon :icon="icon"></ui-icon>
            </slot>
        </div>

        <div
                class="ui-slider__track"
                ref="track"
                @mousedown="onDragStart"
                @touchstart="onDragStart"
        >
            <div class="ui-slider__track-background">
                <span
                        class="ui-slider__snap-point"
                        :style="{ left: point + '%' }"

                        v-if="snapToSteps"
                        v-for="point in snapPoints"
                ></span>
            </div>

            <div class="ui-slider__track-fill" :style="fillStyle"></div>

            <div class="ui-slider__thumb" ref="thumb" :style="thumbStyle">
                <div class="ui-slider__marker" v-if="showMarker">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
                        <path d="M11 .5c-1.7.2-3.4.9-4.7 2-1.1.9-2 2-2.5 3.2-1.2 2.4-1.2 5.1-.1 7.7 1.1 2.6 2.8 5 5.3 7.5 1.2 1.2 2.8 2.7 3 2.7 0 0 .3-.2.6-.5 3.2-2.7 5.6-5.6 7.1-8.5.8-1.5 1.1-2.6 1.3-3.8.2-1.4 0-2.9-.5-4.3-1.2-3.2-4.1-5.4-7.5-5.8-.5-.2-1.5-.2-2-.2z"/>
                    </svg>

                    <span class="ui-slider__marker-text">{{ markerText }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { UiSlider } from 'keen-ui';

  export default {
    props: ['minValue', 'maxValue'],
    computed: {
      fillStyle() {
        return { transform: 'scaleX(' + this.percentage(this.localValue) + ')' };
      },
      thumbStyle() {
        return {
          transform: 'translateX(' + (
            (this.percentage(this.localValue) * this.trackLength) - (this.thumbSize / 2)
          ) + 'px)'
        };
      }
    },
    methods: {
      setValue(value) {
        console.log(value);
        if (value > this.maxValue) {
          value = this.maxValue;
        } else if (value < this.minValue) {
          value = this.minValue;
        }
        if (value === this.localValue) {
          return;
        }
        this.localValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
      },
      initializeDrag() {
        const value = this.getEdge(this.localValue ? this.localValue : this.minValue, this.minValue, this.maxValue);
        this.setValue(value);
      },
      getPointStyle(point) {
        return {
          left: this.percentage(point) + '%'
        };
      },
      percentage(point) {
        return (point - this.minValue) / (this.maxValue - this.minValue);
      },
      dragUpdate(e) {
        const position = e.touches ? e.touches[0].pageX : e.pageX;
        const value = this.getEdge(
          this.minValue + ((position - this.trackOffset) / this.trackLength) * (this.maxValue - this.minValue),
          this.minValue,
          this.maxValue
        );
        if (this.isDragging) {
          this.setValue(Math.round(value));
        }
      }
    },
    extends: UiSlider
  }
</script>