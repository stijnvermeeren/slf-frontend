<template>
  <div id="container">
    <div class="current">
      <div class="label">
        <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation.html#schneedeckewetter">
          Current avalanche bulletin on slf.ch
        </a>
      </div>
      <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation.html#lawinengefahr">
        <img src="https://www.slf.ch/avalanche/bki/bki_de_c_teaser.gif" alt="Current avalanche forecast from slf.ch" />
      </a>
    </div>
    <h2>Stijn's SLF Map Viewer</h2>
    <div v-if="loaded">
      <Viewer :initialDate="new Date()"></Viewer>
    </div>
    <div v-else>
      Loading...
    </div>
    <div class="about">
      <h2>About</h2>
      <p>This web page aims to make the maps from the <a href="https://www.slf.ch/de/lawinenbulletin-und-schneesituation/archiv.html">SLF archive</a> more accessible, giving easy insights into questions like:</p>
      <ul>
        <li>How much snow is there compared to last year?</li>
        <li>How did the snow depth evolve over the course of the winter?</li>
        <li>How much snow is there currently, compared to the date of a particular photo or ski touring report (e.g. <a href="http://www.gipfelbuch.ch/gipfelbuch/verhaeltnisse">Gipfelbuch</a>, <a href="http://www.hikr.org/">Hikr</a>, <a href="https://www.camptocamp.org/">Camptocamp</a>).</li>
      </ul>
      <p>New maps are loaded from the SLF website every day at 10am and at 6pm Central European Time.</p>
      <p>Maps by <a href="http://www.slf.ch">SLF.ch</a>. Web page by <a href="https://stijnvermeeren.be">Stijn Vermeeren</a> (<a href="https://github.com/stijnvermeeren/slf-frontend">Github project</a>). <a href="https://stijnvermeeren.be/contact">Feedback</a> welcome.</p>
    </div>
  </div>
</template>

<script>
  import Viewer from './Viewer.vue'

  export default {
    components: {
      Viewer
    },
    computed: {
      loaded() {
        return this.$store.state.isLoaded;
      }
    },
    created() {
      this.$gtag.pageview('/');
      this.$store.dispatch('load');
    },
  }
</script>

<style lang="scss">
  /* Keen-ui fix for z-index of UiSwitch which otherwise interferes with the overlay */
  .ui-switch {
    .ui-switch__track {
      z-index: 0;
    }
    .ui-switch__thumb {
      z-index: 1;
    }
  }

  div#container {
    position: relative;
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

    text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  div.current {
    position: absolute;
    top: 10px;
    right: 10px;

    padding: 5px;
    background-color: rgba(33, 150, 243, .3);
    border-radius: 5px;

    text-align: center;

    div.label {
      font-weight: bold;
      font-size: 70%;
    }
    img {
      width: 160px;
    }
  }

  div.about {
    margin: 40px 20px;
    padding: 10px;

    background-color: #eeeeee;
    border-radius: 2px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);

    h2 {
      margin-top: 10px;
    }
  }
</style>
