<template>
  <div id="container">
    <div v-if="initialYear && initialCategory && initialDate">
      <Viewer :initialYear="initialYear" :initialCategory="initialCategory" :initialDate="initialDate"></Viewer>
    </div>
    <div v-else>
      Loading...
    </div>
    <div class="about">
      <h2>About</h2>
      <p>This webpage aims to make the maps from the <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation/archiv.html">SLF archive</a> more accessible, giving easy insights into questions like:</p>
      <ul>
        <li>How much snow is there compared to last year?</li>
        <li>How did the snow depth evolve over the course of the winter?</li>
        <li>How much snow is there currently, compared to the date of a particular photo or ski touring report (e.g. <a href="http://www.gipfelbuch.ch/gipfelbuch/verhaeltnisse">Gipfelbuch</a>, <a href="http://www.hikr.org/">Hikr</a>, <a href="https://www.camptocamp.org/">Camptocamp</a>).</li>
      </ul>
      <p>Webpage by <a href="http://stijnvermeeren.be">Stijn Vermeeren</a> (<a href="https://github.com/stijnvermeeren/slf-frontend">Github project</a>). Maps by <a href="http://www.slf.ch">SLF.ch</a>.</p>
    </div>
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

  div.about {
    background-color: rgba(0, 0, 0, 0.24);
    margin: 20px 0;
    padding: 10px;

    h2 {
      margin-top: 10px;
    }
  }
</style>
