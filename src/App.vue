<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-select :items="jobTypes" filled label="Job type" />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { VApp, VContainer, VRow, VCol, VSelect } from 'vuetify/lib';
export default {
  name: 'sievero-form',
  components: {
    VApp,
    VContainer,
    VRow,
    VCol,
    VSelect
  },
  data() {
    return {
      jobTypes: ['Full time', 'Part time', 'Contract']
    };
  }
};
</script>
