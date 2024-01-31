<template>
    <v-card class="pa-0" elevation="0">
        <v-card-text class="px-8 py-10 px-md-10">
            <div class="d-flex align-center justify-space-between mb-5">
                <div class="text-h5 font-weight-bold black--text mb-2" style="max-width: 300px">
                    Provide delivery details
                </div>
                <v-btn @click="$emit('back')" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
            <ValidationObserver ref="observer">
                <form>
                    <v-card class="px-6 py-2" outlined>
                        <div class="body-1 text-left pa-0 blue--text text--darken-4 mt-3 mb-7 font-weight-bold">
                            Contact details
                        </div>
                        <ValidationProvider name="full_name" rules="required" v-slot="{ errors }">
                            <v-text-field class="input-lg" :disabled="loading" :error-messages="errors" dense
                                label="Name" v-model="values.full_name"></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
                            <v-text-field class="input-lg" :disabled="loading" :error-messages="errors" dense
                                label="Email address" v-model="values.email"></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider name="phone_no" rules="required|phone" v-slot="{ errors }">
                            <v-text-field class="input-lg" :disabled="loading" :error-messages="errors" dense
                                label="Phone number" v-model="values.phone_no"></v-text-field>
                        </ValidationProvider>
                    </v-card>
                    <v-card class="px-6 py-2 mt-5" outlined>
                        <div class="body-1 text-left pa-0 blue--text text--darken-4 mt-3 mb-2 font-weight-bold">
                            Home address
                        </div>
                        <p class="mb-7">Please fill in a correct address</p>
                        <ValidationProvider name="address" rules="required" v-slot="{ errors }">
                            <v-textarea class="input-lg" :disabled="loading" :error-messages="errors" dense
                                label="Address" placeholder="format: House No, Street, LGA" rows="2"
                                v-model="values.address"></v-textarea>
                        </ValidationProvider>
                    </v-card>
                </form>
                <v-btn :loading="loading" @click="validate" block class="mt-10" color="primary" elevation="0" large>
                    Continue
                </v-btn>
            </ValidationObserver>
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: 'iPhone14Checkout',
    data() {
        return {
            loading: false,
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
    methods: {
        async validate() {
            const valid = await this.$refs.observer.validate();
            if (valid) {
                if (this.checkout) await this.submit()
                else this.$emit('done', this.values);
            }
        },
    }
}


</script>
<style lang="scss" scoped>

</style>