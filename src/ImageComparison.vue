<template>
    <div id="twenty-twenty">
        <TwentyTwenty :before="image" :beforeLabel="dateLabel(date)" :after="compareImage" :afterLabel="dateLabel(compareDate)" />
    </div>
</template>

<script>
    import TwentyTwenty from 'vue-twentytwenty';
    import dates from './dates';

    export default {
        props: ['image', 'date', 'compareImage', 'compareDate'],
        components: {
          TwentyTwenty
        },
        methods: {
          dateLabel(date) {
            return date ? dates.fullFormat(date) : 'No data';
          }
        }
    }
</script>

<style lang="scss">
    $twenty-twenty-color: rgba(33, 150, 243, .8);

    img {
        width: 800px;
    }

    #twenty-twenty .twentytwenty-container {
        .twentytwenty-handle:before, .twentytwenty-handle:after {
            border-color: $twenty-twenty-color;
        }
        .twentytwenty-handle {
            border-color: $twenty-twenty-color;
        }

        .twentytwenty-arrow-right {
            border-left-color: $twenty-twenty-color;
        }
        .twentytwenty-arrow-left {
            border-right-color: $twenty-twenty-color;
        }

        .twentytwenty-before-label, .twentytwenty-after-label {
            color: black;
            background: $twenty-twenty-color;
            bottom: 0;
            top: auto;
        }

        .twentytwenty-overlay {
            background: transparent;
            opacity: 1;
        }
    }
</style>