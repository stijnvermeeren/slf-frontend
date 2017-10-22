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
    $twenty-twenty-color: rgba(33,150,243,.6);

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
            background: rgba(255, 255, 255, 0.6);
        }

        .twentytwenty-overlay {
            opacity: 0;
            transition-property: opacity;
            background: rgba(0, 0, 0, 0.5);
        }
        .twentytwenty-overlay:hover {
            opacity: 1;
        }
    }
</style>