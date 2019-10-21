/*
  Temporary vuetify-algolia-places replacement with support for selecting multiple

  Code from https://github.com/sievero/vuetify-algolia-places, our fork of
  https://github.com/Kocal/vuetify-algolia-places. Waiting on PR to be merged
  so we can use the npm package. 
*/

import VuetifyAlgoliaPlaces from './VuetifyAlgoliaPlaces.vue';

const defaultOptions = {
  algolia: {
    apiKey: null,
    appId: null
  }
};

const install = (Vue, options = {}) => {
  options = { ...defaultOptions, ...options };

  Vue.$vuetifyAlgoliaPlacesOptions = options;
  Vue.mixin({
    created() {
      this.$vuetifyAlgoliaPlacesOptions = options;
    }
  });

  Vue.component('vuetify-algolia-places', VuetifyAlgoliaPlaces);
};

export default install;
