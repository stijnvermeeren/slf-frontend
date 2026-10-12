<template>
    <label class="toggle-switch">
        <span class="toggle">
            <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
            <span class="toggle-slider"></span>
        </span>
        <slot />
    </label>
</template>

<script>
    export default {
        props: {
            modelValue: {
                type: Boolean,
                required: true
            }
        },
        emits: ['update:modelValue']
    }
</script>

<style lang="scss" scoped>
    .toggle-switch {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        cursor: pointer;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
        flex-shrink: 0;

        input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }

        .toggle-slider {
            position: absolute;
            inset: 0;
            background: #ccc;
            border-radius: 20px;
            transition: background 0.2s;

            &::before {
                content: '';
                position: absolute;
                width: 14px;
                height: 14px;
                left: 3px;
                top: 3px;
                background: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
        }

        input:checked + .toggle-slider {
            background: #2196F3;
        }

        input:checked + .toggle-slider::before {
            transform: translateX(16px);
        }
    }
</style>
