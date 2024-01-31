<template>
  <v-card elevation="0" class="pa-0">
    <v-card-text class="py-5 pb-10 px-6 px-md-10">
      <div class="d-flex justify-end mb-1 fill-width">
        <v-btn @click="$emit('close')" color="white" small icon style="background: tomato">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
      <div v-if="!success" class="d-flex flex-column align-center justify-center text-center">
        <v-icon color="primary" size="100" class="mr-3">mdi-face-agent</v-icon>
        <h2 class="mt-4">Need support?</h2>
        <p class="mt-1 black--text mt-2">
          Enter your details below, let's call you in 5 minutes.
        </p>
        <ValidationObserver ref="observer" class="fill-width">
          <form class="mt-8">
            <v-card class="px-6 py-2 fill-width" outlined>
              <div class="body-1 text-left pa-0 blue--text text--darken-4 mt-3 mb-7 font-weight-bold">
                Contact details
              </div>
              <ValidationProvider name="full_name" rules="required" v-slot="{ errors }">
                <v-text-field
                  :disabled="loading"
                  :error-messages="errors"
                  dense
                  label="Name"
                  v-model="values.full_name"
                ></v-text-field>
              </ValidationProvider>
              <ValidationProvider name="phone_no" rules="required|phone" v-slot="{ errors }">
                <v-text-field
                  :disabled="loading"
                  :error-messages="errors"
                  dense
                  label="Phone number"
                  v-model="values.phone_no"
                ></v-text-field>
              </ValidationProvider>
              <v-textarea
                :disabled="loading"
                dense
                label="Comment"
                rows="2"
                v-model="values.comment"
              ></v-textarea>
            </v-card>
            <div>
              <v-btn
                :loading="loading" block @click="sendContactDetails()" class="mt-5" color="primary" elevation="0" large
              >
                Request call back
              </v-btn>
              <v-btn
                :disabled="loading" block @click="$emit('close')" class="mt-2" color="primary" text elevation="0" large
              >
                No I will select myself
              </v-btn>
            </div>
          </form>
        </ValidationObserver>
      </div>
      <div v-else class="py-16 d-flex flex-column justify-center align-center text-center">
        <v-icon color="primary" size="100"> mdi-checkbox-marked-circle</v-icon>
        <p class="mt-6 black--text body-1">
          Thank you, we will contact you shortly. You can also reach us on
          +2349155577731
        </p>
        <v-btn href="tel:+2349155577731" outlined class="mt-6">
          <v-icon class="mr-3">mdi-phone</v-icon>
          Call +2349155577731
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ContactSupport',
  data() {
    return {
      loading: false,
      success: false,
      values: {
        full_name: '',
        phone_no: '',
        comment: '',
      },
      disabled: false,
    };
  },
  methods: {
    async sendContactDetails() {
      this.loading = true;
      try {
        await this.$http.post('https://sellbackend.creditclan.com/merchantclan/public/index.php/api/enquiry', {
          name: this.values.full_name,
          phone: this.values.phone_no,
          comment: this.values.comment,
          ecosystem: 'shop',
        });
        this.success = true;
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
