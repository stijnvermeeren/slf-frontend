import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoaded: false,
    images: {}
  },
  getters: {
    availableIsoDateStrings: (state) => category => {
      const result = [];

      if (state.images[category]) {
        return state.images[category].forEach( fileName => {
          // remove the file extension from the date-named image
          result.push(fileName.split(".")[0]);
        });
      }

      return result;
    },
    imageUrl: state => (category, sizeType, fileName) => {
      return [
        "https://s3.eu-central-1.amazonaws.com/slf.stijnvermeeren.be",
        category,
        sizeType,
        fileName + '.png'
      ].join("/");
    },
    compareImageUrl: (state, getters) => (category, dateString) => {
      if (state.images && state.images[category]) {
        if (state.images[category].includes(dateString)) {
          return getters.imageUrl(category, 'optimised', dateString)
        }
      }

      /**
       * Uniform gray fallback image, generated from http://png-pixel.com/ with #dddddd, opacity=1, 640x452
       */
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHECAQAAAAD5VNPAAAET0lEQVR42u3UQQEAAAQEMNc/knCU8LOFWHoK4KUIEBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECAgQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQICBAAQICBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAgIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEBAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQEKEBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECAgQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQICAAAUICBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAgIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQEKAAAQECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBAQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAgAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAAAIEECCAAAEECCBAAAECCBBAgAACBBAggAABBAggQAABAgIUICBAAAECCBBAgAACBBAggAABBAggQAABAggQQIAAAgQQIIAAAQQIIEAAAQIIEECAABcWqpoOWom2pKMAAAAASUVORK5CYII=";
    },
    fileNames: state => (category, dateString) => {
      if (state.images[category]) {
        return state.images[category]
          .filter(fileName => fileName.startsWith(dateString))
          .sort((a, b) => Number(a.substr(11)) > Number(b.substr(11)) ? 1 : -1);
      } else {
        return [];
      }
    }
  },
  mutations: {
    update(state, json) {
      state.images = json;
      state.isLoaded = true;
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
