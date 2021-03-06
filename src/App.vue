<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row justify="center" class="text-center">
          <v-col cols="auto">
            <v-alert type="error" dismissible v-model="errorAlert"
              >There was an error submitting this form</v-alert
            >
            <v-alert type="success" dismissible v-model="successAlert"
              >Success! Check your inbox for a welcome email</v-alert
            >

            <v-btn
              v-if="successAlert"
              href="https://sievero.com"
              outlined
              class="text-none"
            >
              Back to sievero.com
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-stepper v-model="stepper">
              <v-stepper-header>
                <v-stepper-step
                  :complete="!$v.skillForm.skills.$invalid"
                  step="1"
                  editable
                  :rules="[() => !$v.skillForm.skills.$invalid]"
                >
                  Complete this form
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                  :complete="!$v.emailForm.$invalid"
                  step="2"
                  editable
                  :rules="[
                    () => !($v.emailForm.$invalid && $v.emailForm.$dirty)
                  ]"
                >
                  Tell us how to contact you
                </v-stepper-step>
                <v-divider />
                <v-stepper-step step="3" editable>
                  Review and submit
                </v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-container>
                    <v-row dense>
                      <v-col>
                        <div class="headline">Skills</div>
                        <div class="body-2 mb-2">
                          List the tools, technologies, languages, and
                          third-party APIs (Algolia, Stripe, Auth0, etc.) you
                          use.
                          <span class="font-weight-bold"
                            >We will only show you jobs whose requirements are a
                            subset of your skills</span
                          >, meaning you will at least meet the minimum
                          requirements of every job we send you.
                        </div>
                        <v-card outlined>
                          <v-card-text>
                            <v-data-iterator
                              disable-filtering
                              disable-pagination
                              disable-sort
                              :items="skillForm.skills"
                              item-key="name"
                              hide-default-footer
                            >
                              <template v-slot:item="{ item }">
                                <v-chip
                                  label
                                  close
                                  @click:close="deleteSkill(item)"
                                  class="mb-1 mr-1"
                                >
                                  <span class="font-weight-bold mr-1">{{
                                    item.name
                                  }}</span>
                                  ({{ item.value }} {{ item.unit }})
                                </v-chip>
                              </template>

                              <template v-slot:no-data>
                                <span class="red--text"
                                  >You must add at least one skill</span
                                >
                              </template>
                            </v-data-iterator>

                            <div class="my-1">
                              Specify how long you've been using each skill
                            </div>

                            <form>
                              <v-row dense>
                                <v-col cols="12" xs="12" sm="4">
                                  <v-text-field
                                    label="Name"
                                    v-model="skillForm.skill.name"
                                    outlined
                                    required
                                    @input="$v.skillForm.skill.name.$touch()"
                                    @blur="$v.skillForm.skill.name.$touch()"
                                    :error-messages="nameErrors"
                                  />
                                </v-col>
                                <v-col cols="12" xs="12" sm="4">
                                  <v-text-field
                                    label="Value"
                                    v-model="skillValue"
                                    outlined
                                    required
                                    @input="$v.skillForm.skill.value.$touch()"
                                    @blur="$v.skillForm.skill.value.$touch()"
                                    type="number"
                                    :error-messages="valueErrors"
                                    persistent-hint
                                    hint="Number of months or years"
                                  />
                                </v-col>
                                <v-col cols="12" xs="12" sm="4">
                                  <v-select
                                    v-model="skillForm.skill.unit"
                                    :items="units"
                                    outlined
                                    label="Unit"
                                    required
                                    @input="$v.skillForm.skill.unit.$touch()"
                                    @blur="$v.skillForm.skill.unit.$touch()"
                                    :error-messages="unitErrors"
                                  />
                                </v-col>
                              </v-row>
                              <v-row justify="center">
                                <v-col cols="auto">
                                  <v-btn
                                    :disabled="$v.skillForm.skill.$invalid"
                                    class="text-none"
                                    color="primary"
                                    @click="addSkill"
                                    >Add skill</v-btn
                                  >
                                </v-col>
                              </v-row>
                            </form>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-radio-group
                          class="mt-0"
                          v-model="jobForm.locationPreference"
                          row
                          hide-details
                        >
                          <v-radio
                            :label="includeBothText"
                            :value="includeBothText"
                          />
                          <v-radio
                            :label="onSiteOnlyText"
                            :value="onSiteOnlyText"
                          />
                          <v-radio
                            :label="remoteOnlyText"
                            :value="remoteOnlyText"
                          />
                        </v-radio-group>

                        <div class="body-2 mt-3 mb-2">
                          List where you would like to work. If remote, note
                          that some companies have a preferred timezone, state,
                          country, etc. for their remote jobs. Pick the
                          locations where you will be spending most of your time
                          as a remote worker.
                        </div>

                        <vuetify-algolia-places
                          v-model="jobForm.locations"
                          :search-input.sync="locationsQuery"
                          multiple
                          cache-items
                          chips
                          deletable-chips
                          outlined
                          :debounce="250"
                          label="Locations"
                        />

                        <v-select
                          v-model="jobForm.jobType"
                          :items="jobTypes"
                          outlined
                          multiple
                          label="Job type"
                        />
                        <v-text-field
                          label="Minimum salary (USD)"
                          type="number"
                          v-model="jobForm.salary"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <div class="body-2 my-2">
                    Currently we only support contacting you via email, but plan
                    to support other methods in the future.
                  </div>

                  <form>
                    <v-text-field
                      class="mt-2"
                      autofocus
                      label="Email"
                      v-model="emailForm.email"
                      :error-messages="emailErrors"
                      outlined
                      type="email"
                      required
                      @input="$v.emailForm.email.$touch()"
                      @blur="$v.emailForm.email.$touch()"
                    />
                  </form>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Job type
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <template v-if="jobForm.jobType.length > 0">
                          <span v-for="(type, i) in jobForm.jobType" :key="i">
                            {{ type
                            }}{{ i === jobForm.jobType.length - 1 ? '' : ',' }}
                          </span>
                        </template>
                        <template v-else>
                          Any
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Salary
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ jobForm.salary || 'Any' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Location preference
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ jobForm.locationPreference }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Locations
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <template v-if="jobForm.locations.length > 0">
                          <v-chip
                            label
                            v-for="loc in jobForm.locations"
                            :key="loc.value"
                            class="mb-1 mr-1"
                          >
                            {{ loc.value }}
                          </v-chip>
                        </template>
                        <template v-else>
                          Any
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Skills
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip
                          label
                          v-for="skill in skillForm.skills"
                          :key="skill.name"
                          class="mb-1 mr-1"
                        >
                          <span class="font-weight-bold mr-1">{{
                            skill.name
                          }}</span>
                          ({{ skill.value }} {{ skill.unit }})
                        </v-chip>
                        <div
                          v-for="err in skillErrors"
                          class="red--text"
                          :key="`skill-${err}`"
                        >
                          {{ err }}
                        </div>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        Email
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ emailForm.email }}
                        <div
                          v-for="err in emailErrors"
                          class="red--text"
                          :key="`email-${err}`"
                        >
                          {{ err }}
                        </div>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-btn
                    :disabled="
                      $v.emailForm.$invalid ||
                        $v.skillForm.skills.$invalid ||
                        disableSubmit
                    "
                    class="text-none"
                    color="primary"
                    @click="submit"
                    :loading="loading"
                    >Submit</v-btn
                  >
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email, integer } from 'vuelidate/lib/validators';
import axios from 'axios';
import * as Sentry from '@sentry/browser';

export default {
  name: 'sievero-form',
  mixins: [validationMixin],
  data() {
    return {
      jobForm: {
        jobType: [],
        salary: null,
        locations: [],
        locationPreference: 'On-site or remote'
      },
      skillForm: {
        skills: [],
        skill: this.newSkill()
      },
      emailForm: {
        email: ''
      },
      jobTypes: ['Full time', 'Part time', 'Contract'],
      units: ['months', 'years'],
      stepper: 1,
      onSiteOnlyText: 'On-site only',
      remoteOnlyText: 'Remote only',
      includeBothText: 'On-site or remote',
      locationsQuery: null,
      loading: false,
      errorAlert: false,
      successAlert: false,
      disableSubmit: false
    };
  },
  validations: {
    skillForm: {
      skills: {
        required
      },
      skill: {
        name: {
          required
        },
        value: {
          required,
          integer
        },
        unit: {
          required
        }
      }
    },
    emailForm: {
      email: {
        required,
        email
      }
    }
  },
  computed: {
    skillValue: {
      get() {
        return this.skillForm.skill.value;
      },
      set(value) {
        this.skillForm.skill.value = +value;
      }
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.emailForm.email.$dirty) return errors;
      !this.$v.emailForm.email.email && errors.push('Must be valid email');
      !this.$v.emailForm.email.required && errors.push('Required');
      return errors;
    },
    skillErrors() {
      const errors = [];
      !this.$v.skillForm.skills.required && errors.push('Required');
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.skillForm.skill.name.$dirty) return errors;
      !this.$v.skillForm.skill.name.required && errors.push('Required');
      return errors;
    },
    valueErrors() {
      const errors = [];
      if (!this.$v.skillForm.skill.value.$dirty) return errors;
      !this.$v.skillForm.skill.value.required && errors.push('Required');
      !this.$v.skillForm.skill.value.integer &&
        errors.push('Must be an integer');
      return errors;
    },
    unitErrors() {
      const errors = [];
      if (!this.$v.skillForm.skill.unit.$dirty) return errors;
      !this.$v.skillForm.skill.unit.required && errors.push('Required');
      return errors;
    }
  },
  methods: {
    addSkill() {
      this.skillForm.skills = [...this.skillForm.skills, this.skillForm.skill];
      this.skillForm.skill = this.newSkill();
      this.$v.skillForm.$reset();
    },
    deleteSkill(item) {
      this.skillForm.skills = this.skillForm.skills.filter(
        s => s.name !== item.name
      );
    },
    newSkill: () => ({
      name: '',
      value: null,
      unit: ''
    }),
    async submit() {
      try {
        this.loading = true;
        await axios.post('/.netlify/functions/postForm', {
          ...this.jobForm,
          locations: this.jobForm.locations.map(l => l.value).join('; '),
          skills: this.skillForm.skills
            .map(s => `${s.name} (${s.value} ${s.unit})`)
            .join(', '),
          email: this.emailForm.email
        });
        this.disableSubmit = true;
        this.successAlert = true;
        this.$vuetify.goTo(0);
      } catch (error) {
        Sentry.captureException(error);
        this.errorAlert = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
