import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';

/*
  See comment in <script> in ./components/VuetifyAlgoliaPlaces.vue
*/
// import VuetifyAlgoliaPlaces from 'vuetify-algolia-places';
import VuetifyAlgoliaPlaces from './components/vuetify-algolia-places.js';

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
