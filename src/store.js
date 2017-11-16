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
    availableDates: state => (year, category) => {
      if (state.images[year] && state.images[year][category]) {
        return state.images[year][category].map(
          //remove the file extension from the date-named image);
          fileName => fileName.split(".")[0]
        ).sort();
      } else {
        return [];
      }
    },
    imageUrl: state => (year, category, date) => {
      if (state.images[year] && state.images[year][category]) {
        let fileName = state.images[year][category].find(fileName => fileName.split(".")[0] === date);
        if (fileName) {
          return [
            "https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be",
            year,
            category,
            fileName
          ].join("/");
        }
      }

      /**
       * Uniform gray fallback image, generated from http://png-pixel.com/ with #dddddd, opacity=1, 640x452
       */
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHECAQAAAAD5VNPAAAET0lEQVR42u3UQQEAAAQEMNc/knCU8LOFWHoK4KUIEBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECAgQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQICBAAQICBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAgIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEBAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQEKEBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECAgQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQICAAAUICBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAgIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQEKAAAQECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBAQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAgAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAgIUICBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAABcWqpoOWom2pKMAAAAASUVORK5CYII="
    }
  },
  mutations: {
    update(state, json) {
      state.images = json
    }
  },
  actions: {
    load(context) {
      fetch('https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be/data.json').then(
        response => response.json()
      ).then(json => {
        context.commit('update', json);
      });
    }
  }
});
