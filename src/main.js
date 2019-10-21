import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

/*
  See comment in <script> in ./components/VuetifyAlgoliaPlaces.vue
*/
// import VuetifyAlgoliaPlaces from 'vuetify-algolia-places';
import VuetifyAlgoliaPlaces from './components/vuetify-algolia-places.js';

Vue.config.productionTip = false;

Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_URL,
  integrations: [
    new Integrations.Vue({
      Vue,
      logErrors: true,
      environment: process.env.NODE_ENV
    })
  ]
});

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
