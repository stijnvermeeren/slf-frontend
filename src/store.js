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
    imageUrl: state => (year, category, sizeType, fileName) => {
      return [
        "https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be",
        year,
        category,
        sizeType,
        fileName + '.png'
      ].join("/");
    },
    compareImageUrl: (state, getters) => (year, category, dateString) => {
      if (state.images[year] && state.images[year][category]) {
        if (state.images[year][category].includes(dateString)) {
          return getters.imageUrl(year, category, 'optimised', dateString)
        }
      }

      /**
       * Uniform gray fallback image, generated from http://png-pixel.com/ with #dddddd, opacity=1, 640x452
       */
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHECAQAAAAD5VNPAAAET0lEQVR42u3UQQEAAAQEMNc/knCU8LOFWHoK4KUIEBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECAgQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQICBAAQICBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAgIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEBAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQEKEBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECAgQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQICAAAUICBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAgIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQEKAAAQECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBAQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAgAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAgIUICBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAABcWqpoOWom2pKMAAAAASUVORK5CYII=";
    },
    fileNames: state => (year, category, dateString) => {
      if (state.images[year] && state.images[year][category]) {
        return state.images[year][category]
          .filter(fileName => fileName.startsWith(dateString))
          .sort((a, b) => Number(a.substr(11)) > Number(b.substr(11)) ? 1 : -1);
      } else {
        return [];
      }
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
