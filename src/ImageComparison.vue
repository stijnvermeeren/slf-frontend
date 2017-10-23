<template>
    <div id="twenty-twenty">
        <TwentyTwenty :before="image" :beforeLabel="date" :after="compareImage" :afterLabel="compareDate" />
    </div>
</template>

<script>
    import TwentyTwenty from 'vue-twentytwenty';

    export default {
        props: ['image', 'date', 'compareImage', 'compareDate'],
        components: {
          TwentyTwenty
        }
    }
</script>

<style lang="scss">
    $twenty-twenty-color: rgba(33, 150, 243, .8);

    #twenty-twenty .twentytwenty-container {
        * {
            box-sizing: content-box;
        }

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
            transition-property: none;
            background: transparent;
        }
        .twentytwenty-overlay:hover {
        }
    }
</style>