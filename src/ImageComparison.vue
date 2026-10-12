<template>
    <div
        class="img-comparison"
        ref="container"
        @mousemove="onMove"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchmove.prevent="onMove"
        @touchend="stopDrag"
    >
        <img :src="image" :alt="dateLabel(date)" />
        <img
            :src="compareImage"
            :alt="dateLabel(compareDate)"
            class="compare-img"
            :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
        />
        <div
            class="handle"
            :style="{ left: position + '%' }"
            @mousedown.stop="startDrag"
            @touchstart.stop.prevent="startDrag"
        >
            <div class="handle-knob">◀ ▶</div>
        </div>
        <div class="label label-before">{{ dateLabel(date) }}</div>
        <div class="label label-after">{{ dateLabel(compareDate) }}</div>
    </div>
</template>

<script>
    import dates from './dates';

    export default {
        props: ['image', 'date', 'compareImage', 'compareDate'],
        data() {
            return {
                position: 50,
                dragging: false
            };
        },
        methods: {
            dateLabel(d) {
                return d ? dates.fullFormat(d) : 'No data';
            },
            startDrag() {
                this.dragging = true;
            },
            stopDrag() {
                this.dragging = false;
            },
            onMove(e) {
                if (!this.dragging) return;
                const rect = this.$refs.container.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                this.position = (x / rect.width) * 100;
            }
        }
    }
</script>

<style lang="scss">
    $comparison-color: rgba(33, 150, 243, .8);

    .img-comparison {
        position: relative;
        display: inline-block;
        cursor: ew-resize;
        user-select: none;

        img {
            width: 800px;
            display: block;
        }

        .compare-img {
            position: absolute;
            top: 0;
            left: 0;
        }

        .handle {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 4px;
            margin-left: -2px;
            background: $comparison-color;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .handle-knob {
                background: $comparison-color;
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 14px;
                white-space: nowrap;
            }
        }

        .label {
            position: absolute;
            bottom: 0;
            background: $comparison-color;
            color: black;
            font-weight: bold;
            padding: 4px 8px;
            font-size: 13px;
        }

        .label-before {
            left: 0;
        }

        .label-after {
            right: 0;
        }
    }
</style>
