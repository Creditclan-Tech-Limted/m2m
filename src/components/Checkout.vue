<template>
  <v-card class="pa-0" elevation="0">
    <CheckoutAlert v-if="success" @continue="finish()"/>

    <v-card-text v-else class="px-8 py-10 px-md-10">
      <div class="d-flex mb-8 black--text justify-space-between align-center">
        <h2>Provide delivery details</h2>
        <v-btn @click="$emit('cancel')" color="red" icon outlined small>
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
      <ValidationObserver ref="observer">
        <form>
          <v-card class="px-6 py-2" outlined>
            <div class="body-1 text-left pa-0 blue--text text--darken-4 mt-3 mb-7 font-weight-bold">
              Contact details
            </div>
            <ValidationProvider name="full_name" rules="required" v-slot="{ errors }">
              <v-text-field
                class="input-lg"
                :disabled="loading"
                :error-messages="errors"
                dense
                label="Name"
                v-model="values.full_name"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
              <v-text-field
                class="input-lg"
                :disabled="loading"
                :error-messages="errors"
                dense
                label="Email address"
                v-model="values.email"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="phone_no" rules="required|phone" v-slot="{ errors }">
              <v-text-field
                class="input-lg"
                :disabled="loading"
                :error-messages="errors"
                dense
                label="Phone number"
                v-model="values.phone_no"
              ></v-text-field>
            </ValidationProvider>
          </v-card>
          <v-card class="px-6 py-2 mt-5" outlined>
            <div class="body-1 text-left pa-0 blue--text text--darken-4 mt-3 mb-2 font-weight-bold">
              Home address
            </div>
            <p class="mb-7">This address will be used for delivery</p>
            <ValidationProvider name="address" rules="required" v-slot="{ errors }">
              <v-textarea
                class="input-lg"
                :disabled="loading"
                :error-messages="errors"
                dense
                label="Address"
                placeholder="format: House No, Street, LGA"
                rows="2"
                v-model="values.address"
              ></v-textarea>
            </ValidationProvider>
            <ValidationProvider name="state" rules="required" v-slot="{ errors }">
              <v-select
                class="input-lg"
                :disabled="loading"
                :error-messages="errors"
                :items="states"
                :loading="!states.length"
                dense
                label="State"
                v-model="values.state"
              ></v-select>
            </ValidationProvider>
          </v-card>
        </form>
        <v-btn :loading="loading" @click="validate" block class="mt-10" color="primary" elevation="0" large rounded>
          {{ outright ? 'Checkout' : 'Get funded' }}
        </v-btn>
        <v-btn :disabled="loading" @click="$emit('cancel')" block class="mt-2" color="red" large text>Cancel</v-btn>
      </ValidationObserver>
    </v-card-text>
  </v-card>
</template>

<script>
import states from "@/lib/states";
import CheckoutAlert from "./CheckoutAlert.vue";

export default {
  name: "Checkout",
  components: { CheckoutAlert },
  props: {
    checkout: {
      type: Boolean,
      default: true
    },
    lender: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      states,
      lgas: [],
      values: {
        full_name: '',
        email: '',
        phone_no: '',
        address: '',
        state: null
      },
      success: false,
      request_id: null,
    }
  },
  created() {
    const { phone, ...personal } = this.$store.state.customer.personal;
    this.values = { ...personal, phone_no: phone }
  },
  computed: {
    repayment() {
      return this.$store.getters["cart/repayment"]
    },
    outright() {
      return this.$store.getters["cart/outright"]
    },
  },
  methods: {
    async validate() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        if (this.checkout) await this.submit()
        else this.$emit('done', this.values);
      }
    },
    async submit() {
      this.loading = true;
      this.request_id = await this.createGlobalRequest();
      this.loading = false
      if (this.outright) return this.finish();
      else this.success = true;
    },
    async finish() {
      this.$store.commit('request/clear');
      this.$store.commit('cart/clear');
      await this.$router.push(`/request/${ this.request_id }`);
      this.$emit('done');
      this.success = false;
    },
    async createItem(item) {
      const res = await this.$http.post('https://sellbackend.creditclan.com/merchantclan/public/index.php/api/item/instore', {
        name: item.name,
        price: item.price,
        primary_picture: item.images[0],
        description: item.description,
        source: item.source
      });
      return { ...res.data.data, plan: item.plan };
    },
    async createGlobalRequest() {
      try {
        const { items } = this.$store.state.cart;
        const _items = items.map(async item => {
          if (`${ item.id }`.startsWith('temp')) return this.createItem(item);
          return Promise.resolve(item);
        });
        const __items = await Promise.all(_items);
        const payload = {
          items: [...__items.map(item => ({ ...item, merchant_id: item.merchant_slug }))],
          ...this.values,
          lender: this.lender
        };
        const res = await this.$http.post('https://sellbackend.creditclan.com/parent/index.php/globalrequest/createglobalorder', payload)
        return res.data.global_request_id;
      } catch (e) {
        console.log('Request error..', { e });
        return false
      }
    },
  },
}
</script>
