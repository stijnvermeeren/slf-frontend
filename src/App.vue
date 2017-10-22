<template>
  <div id="container">
    <div v-if="initialYear && initialCategory && initialDate">
      <Viewer :initialYear="initialYear" :initialCategory="initialCategory" :initialDate="initialDate"></Viewer>
    </div>
    <div v-else>
      Loading...
    </div>
    <ui-collapsible title="About">
      Webpage by <a href="http://stijnvermeeren.be">Stijn Vermeeren</a> (<a href="https://github.com/stijnvermeeren/slf-frontend">Github project</a>). Maps by <a href="http://www.slf.ch">SLF.ch</a>.
    </ui-collapsible>
  </div>
</template>

<script>
  import Viewer from './Viewer.vue'

  export default {
    data() {
      return {
        initialCategory: 'depth'
      }
    },
    computed: {
      initialYear() {
        return this.$store.getters.currentYear;
      },
      initialDate() {
        let availableDates = this.$store.getters.availableDates(this.initialYear, this.initialCategory);
        return availableDates[availableDates.length - 1];
      }
    },
    components: {
      Viewer
    },
    created() {
      this.$store.dispatch('load');
    },
  }
</script>

<style lang="scss">
  div#container {
    width: 800px;
    margin: 0 auto;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
  }
</style>
