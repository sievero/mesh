import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VuetifyAlgoliaPlaces from 'vuetify-algolia-places';

Vue.config.productionTip = false;

Vue.use(VuetifyAlgoliaPlaces, {
  algolia: {
    appId: process.env.VUE_APP_ALGOLIA_PLACES_APP_ID,
    apiKey: process.env.VUE_APP_ALGOLIA_PLACES_SEARCH_API_KEY
  }
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
