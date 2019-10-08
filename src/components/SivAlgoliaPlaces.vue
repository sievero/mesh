<template>
  <input ref="locations" />
</template>

<script>
import placesWidget from 'places.js/instantsearchWidget';

export default {
  data() {
    return {
      placesClient: null
    };
  },
  mounted() {
    console.log(this.$refs.locations);
    this.placesClient = placesWidget({
      appId: process.env.VUE_APP_ALGOLIA_PLACES_APP_ID,
      apiKey: process.env.VUE_APP_ALGOLIA_PLACES_SEARCH_API_KEY,
      container: this.$refs.locations,
      style: false,
      debug: process.env.NODE_ENV !== 'production'
    });
  }
};
</script>
