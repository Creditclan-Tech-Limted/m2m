<template>
  <div>
    <v-sheet class="d-flex flex-column align-center justify-center py-10 px-10" v-if="view === 'verify'">
      <v-icon color="primary" size="100">mdi-email-variant</v-icon>
      <div class="text-h6 font-weight-bold mt-16">Verify your email</div>
      <div class="text-title text-center mt-5" style="max-width: 350px">
        A verification code has been sent to <br> <span class="font-weight-bold">{{
          $store.state.customer.personal.email
        }}</span>
      </div>
      <v-text-field
        v-model="code"
        :disabled="verifying || resending"
        class="mt-10"
        dense
        label="Enter OTP Code"
        @keydown.enter="verifyCode()"
      ></v-text-field>
      <v-btn :disabled="code.length < 4 || verifying || resending" :loading="verifying" @click="verifyCode()"
             class="mt-5" color="primary" outlined>
        Verify
      </v-btn>
      <p class="mt-4">Not your email address? click <span class="cursor-pointer blue--text" @click="view = 'change'">here</span>
        to change</p>
      <v-btn :disabled="verifying" :loading="resending" class="mt-1" color="red" small text @click="sendEmail()">
        Resend
      </v-btn>
    </v-sheet>
    <v-sheet class="d-flex flex-column align-center justify-center py-10 px-10" v-else-if="view === 'change'">
      <v-icon color="orange" size="100">mdi-email-edit</v-icon>
      <div class="text-h6 font-weight-bold mt-16">Change email address</div>
      <div class="text-title text-center mt-5" style="max-width: 350px">
        Enter your new email address below
      </div>
      <ValidationObserver ref="observer">
        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
          <v-text-field
            v-model="email"
            :disabled="changing"
            :error-messages="errors"
            class="mt-10"
            dense
            label="Enter new email address"
            type="email"
            @keydown.enter="changeEmail()"
          ></v-text-field>
        </ValidationProvider>
      </ValidationObserver>
      <v-btn :disabled="changing" :loading="changing" @click="changeEmail()" class="mt-5" color="primary" outlined>
        Change
      </v-btn>
      <v-btn :disabled="changing" @click="view = 'verify'" class="mt-3" color="red" small text>Cancel</v-btn>
    </v-sheet>
    <v-snackbar :color="snackbar.color" :timeout="5000" top v-model="snackbar.visible">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "VerifyEmail",
  data() {
    return {
      code: '',
      email: '',
      resending: false,
      verifying: false,
      changing: false,
      snackbar: {
        visible: false,
        message: '',
        color: ''
      },
      view: 'verify'
    }
  },
  methods: {
    showSnackbar(message, color) {
      this.snackbar = { visible: true, message, color };
    },
    async sendEmail() {
      this.resending = true;
      try {
        const res = await this.$http.post('https://sellbackend.creditclan.com/merchantclan/public/index.php/api/send/global/email', {
          global_request_id: this.$store.state.request.global_request_id
        });
        this.showSnackbar(res.data.message, 'green');
      } catch (e) {
        this.showSnackbar(e.response.data.message || 'Could not resend, please try again!', 'red');
      }
      this.resending = false;
    },
    async verifyCode() {
      if (!this.code) return;
      this.verifying = true;
      try {
        await this.$http.post('https://sellbackend.creditclan.com/merchantclan/public/index.php/api/verify/global/email', {
          global_request_id: this.$store.state.request.global_request_id,
          email_token: this.code
        });
        this.$store.commit('request/set', { email_verified: 1 });
        this.$emit('done');
      } catch (e) {
        this.showSnackbar(e.response.data.message || 'Could not verify your email, please try again!', 'red');
      }
      this.verifying = false;
    },
    async changeEmail() {
      if (!await this.$refs.observer.validate()) return;
      this.changing = true;
      try {
        await this.$http.post('https://sellbackend.creditclan.com/merchantclan/public/index.php/api/change/global/email', {
          global_request_id: this.$store.state.request.global_request_id,
          email: this.email
        });
        const personal = { ...this.$store.state.customer.personal }
        this.$store.commit('customer/update', { key: 'personal', value: { ...personal, email: this.email } });
        await this.sendEmail()
        this.view = 'verify';
        this.showSnackbar('Email address changed', 'green');
      } catch (e) {
        this.showSnackbar(e.response.data.message || 'Could not verify your email, please try again!', 'red');
      }
      this.changing = false;
    }
  }
}
</script>
