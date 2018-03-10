import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    images: {}
  },
  getters: {
    years: state => {
      return Object.keys(state.images).sort().map(Number);
    },
    currentYear: (state, getters) => {
      let years = getters.years;
      return years[years.length - 1];
    },
    availableIsoDateStrings: (state, getters) => category => {
      const result = [];

      getters.years.forEach(year => {
        if (state.images[year] && state.images[year][category]) {
          return state.images[year][category].forEach( fileName => {
            // remove the file extension from the date-named image
            result.push(fileName.split(".")[0]);
          });
        }
      });

      return result;
    },
    imageUrl: state => (year, category, sizeType, dateString) => {
      if (state.images[year] && state.images[year][category]) {
        if (state.images[year][category].includes(dateString)) {
          return [
            "https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be",
            year,
            category,
            sizeType,
            dateString + '.png'
          ].join("/");
        }
      }

      return undefined;
    }
  },
  mutations: {
    update(state, json) {
      state.images = json
    }
  },
  actions: {
    load(context) {
      /**
       * Format: {"2014":{"relative":["2013-11-28.gif","2013-12-05.gif",...],...},...}
       */
      fetch('https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be/data.json').then(
        response => response.json()
      ).then(json => {
        context.commit('update', json);
      });
    }
  }
});
