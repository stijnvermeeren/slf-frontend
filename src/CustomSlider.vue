<template>
    <div
            class="ui-slider"
            role="slider"

            :aria-valuemax="validatedMaxValue"
            :aria-valuemin="validatedMinValue"
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
                        :style="{ left: 100 * relativeValue(point) + '%' }"

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
    props: {
      name: String,
      icon: String,
      value: {
        type: Number,
        required: true
      },
      minValue: {
        type: Number,
        default: 0
      },
      maxValue: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 10
      },
      snapToSteps: {
        type: Boolean,
        default: false
      },
      steps: Array,
      showMarker: {
        type: Boolean,
        default: false
      },
      markerValue: Number,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        initialValue: this.value,
        isActive: false,
        isDragging: false,
        thumbSize: 0,
        trackLength: 0,
        trackOffset: 0,
        localValue: this.value
      };
    },

    computed: {
      classes() {
        return [
          { 'is-dragging': this.isDragging },
          { 'is-disabled': this.disabled },
          { 'is-active': this.isActive },
          { 'has-icon': this.hasIcon },
          { 'has-marker': this.showMarker }
        ];
      },

      hasIcon() {
        return Boolean(this.$slots.icon) || Boolean(this.icon);
      },

      fillStyle() {
        return { transform: 'scaleX(' + (this.relativeValue(this.localValue)) + ')' };
      },

      thumbStyle() {
        return {
          transform: 'translateX(' + (
            (this.relativeValue(this.localValue) * this.trackLength) - (this.thumbSize / 2)
          ) + 'px)'
        };
      },

      markerText() {
        return this.markerValue ? this.markerValue : this.value;
      },

      snapPoints() {
        if (this.steps !== undefined) {
          return this.steps.filter(
            value => value >= this.validatedMinValue && value <= this.validatedMaxValue
          ).sort();
        }

        const points = [];
        let point = this.step * Math.ceil(this.validatedMinValue / this.step);

        while (point <= this.validatedMaxValue) {
          points.push(point);
          point += this.step;
        }

        return points;
      },

      validatedMinValue() {
        return this.maxValue > this.minValue ? this.minValue : 0;
      },

      validatedMaxValue() {
        return this.maxValue > this.minValue ? this.maxValue : 100;
      }
    },

    mounted() {
      this.initializeSlider();
    },

    beforeDestroy() {
      this.teardownSlider();
    },

    methods: {
      reset() {
        this.setValue(this.initialValue);
      },

      onFocus() {
        this.isActive = true;
        this.$emit('focus');
      },

      onBlur() {
        this.isActive = false;
        this.$emit('blur');
      },

      onExternalClick(e) {
        if (!this.$el.contains(e.target)) {
          this.onBlur();
        }
      },

      setValue(value) {
        value = this.getEdge(value);

        if (value === this.localValue) {
          return;
        }

        this.localValue = value;
        this.$emit('input', value);
        this.$emit('change', value);
      },

      incrementValue() {
        if (this.snapToSteps) {
          this.setValue(this.nextSnapPoint(this.localValue));
        } else {
          this.setValue(this.localValue + this.step);
        }
      },

      decrementValue() {
        if (this.snapToSteps) {
          this.setValue(this.previousSnapPoint(this.localValue));
        } else {
          this.setValue(this.localValue - this.step);
        }
      },

      getTrackOffset() {
        let el = this.$refs.track;
        let offset = el.offsetLeft;

        while (el.offsetParent) {
          el = el.offsetParent;
          offset += el.offsetLeft;
        }

        return offset;
      },

      getPointStyle(point) {
        return {
          left: point + '%'
        };
      },

      refreshSize() {
        this.thumbSize = this.$refs.thumb.offsetWidth;
        this.trackLength = this.$refs.track.clientWidth;
        this.trackOffset = this.getTrackOffset(this.$refs.track);
      },

      initializeSlider() {
        document.addEventListener('touchend', this.onDragStop);
        document.addEventListener('mouseup', this.onDragStop);
        document.addEventListener('click', this.onExternalClick);

        this.$on('window-resize', () => {
          this.refreshSize();
          this.isDragging = false;
        });

        this.refreshSize();
        this.initializeDrag();
      },

      teardownSlider() {
        document.removeEventListener('touchend', this.onDragStop);
        document.removeEventListener('mouseup', this.onDragStop);
        document.removeEventListener('click', this.onExternalClick);
      },

      initializeDrag() {
        const value = this.getEdge(this.localValue ? this.localValue : 0);
        this.setValue(value);
      },

      onDragStart(e) {
        if (this.disabled) {
          return;
        }

        if (!this.isActive) {
          this.onFocus();
        }

        this.isDragging = true;
        this.dragUpdate(e);

        document.addEventListener('touchmove', this.onDragMove);
        document.addEventListener('mousemove', this.onDragMove);

        this.$emit('dragstart', this.localValue, e);
      },

      onDragMove(e) {
        this.dragUpdate(e);
      },

      dragUpdate(e) {
        const position = e.touches ? e.touches[0].pageX : e.pageX;
        const relativeValue = (position - this.trackOffset) / this.trackLength;
        const value = this.getEdge(
          this.validatedMinValue + (relativeValue * (this.validatedMaxValue - this.validatedMinValue))
        );

        if (this.isDragging) {
          this.setValue(Math.round(value));
        }
      },

      onDragStop(e) {
        if (this.isDragging) {
          this.isDragging = false;

          if (this.snapToSteps) {
            const nearestSnapPoint = this.nearestSnapPoint(this.value);
            if (nearestSnapPoint !== this.value) {
              this.setValue(nearestSnapPoint);
            }
          }

          document.removeEventListener('touchmove', this.onDragMove);
          document.removeEventListener('mousemove', this.onDragMove);

          this.$emit('dragend', this.localValue, e);
        }
      },

      previousSnapPoint(value) {
        if (this.snapPoints.length === 0) {
          return value - this.step;
        }

        const previousSnapPoint = [...this.snapPoints].reverse().find(snapPoint => snapPoint < value);

        if (previousSnapPoint === undefined) {
          return this.snapPoints[0];
        }

        return previousSnapPoint;
      },

      nextSnapPoint(value) {
        if (this.snapPoints.length === 0) {
          return value + this.step;
        }

        const nextSnapPoint = this.snapPoints.find(snapPoint => value < snapPoint);

        if (nextSnapPoint === undefined) {
          return this.snapPoints[this.snapPoints.length - 1];
        }

        return nextSnapPoint;
      },

      nearestSnapPoint(value) {
        if (this.snapPoints.length === 0 || this.snapPoints.includes(value)) {
          return value;
        }

        const previousSnapPoint = this.previousSnapPoint(value);
        const nextSnapPoint = this.nextSnapPoint(value);
        const midpoint = (previousSnapPoint + nextSnapPoint) / 2;

        return value >= midpoint ? nextSnapPoint : previousSnapPoint;
      },

      relativeValue(value) {
        return (value - this.validatedMinValue) / (this.validatedMaxValue - this.validatedMinValue);
      },

      getEdge(a) {
        if (a < this.validatedMinValue) {
          return this.validatedMinValue;
        }

        if (a > this.validatedMaxValue) {
          return this.validatedMaxValue;
        }

        return a;
      }
    },
    extends: UiSlider
  }
</script>

<style lang="scss">
    .ui-slider {
        .ui-slider__snap-point {
            opacity: 1;
        }
    }
</style>