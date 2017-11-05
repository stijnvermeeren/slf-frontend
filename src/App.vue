<template>
  <div id="container">
    <div v-if="initialYear && initialCategory && initialDate">
      <Viewer :initialYear="initialYear" :initialCategory="initialCategory" :initialDate="initialDate"></Viewer>
    </div>
    <div v-else>
      Loading...
    </div>
    <h2>About</h2>
    <p>Webpage by <a href="http://stijnvermeeren.be">Stijn Vermeeren</a> (<a href="https://github.com/stijnvermeeren/slf-frontend-vue">Github project</a>). Maps by <a href="http://www.slf.ch">SLF.ch</a>.</p>
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

  /* apply a natural box layout model to all elements, but allowing components to change */
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }

  html {
    font-size: 100%;
    font-family: Roboto, sans-serif;
  }
</style>
