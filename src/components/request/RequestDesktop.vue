<template>
  <div>
    <DefaultDesktopNav/>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-card class="pa-3 position-static d-flex flex-column align-center">
            <ItemsCarousel/>
            <RequestStatus @open="showView($event)"/>
          </v-card>
        </v-col>
        <v-col>
          <div class="fill-height">
            <v-card class="fill-height" light>
              <RequestInvoiceDesktop @open="showView($event)"/>
              <RequestOptions @open="showView($event)"/>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer class="px-7 py-12" fixed right temporary v-model="views.schedule" width="550">
      <div class="text-h6 mb-8">Schedule</div>
      <RequestSchedule :schedule="request.request_schedule" @close="closeViews()"/>
    </v-navigation-drawer>

    <v-navigation-drawer v-model="views.eligibility" fixed right temporary width="550">
      <EligibilityWidget v-if="views.eligibility" @done="reset()" @cancel="views.eligibility = false"/>
    </v-navigation-drawer>

    <v-navigation-drawer fixed right temporary v-model="views.payment" width="550">
      <MakeTransferPayment
        :amount="$store.getters['request/totalOutright']"
        :name="$store.state.customer.personal.full_name"
        :phone="$store.state.customer.personal.phone"
        @cancel="closeViews()"
        @done="handlePaymentDone($event)"
      />
    </v-navigation-drawer>
  </div>
</template>

<script>
import RequestSchedule from "./RequestSchedule";
import request from "../../mixins/request";
import views from "../../mixins/views";
import EligibilityWidget from "@/components/request/EligibilityWidget";
import RequestOptions from "./RequestOptions";
import RequestInvoiceDesktop from "./RequestInvoiceDesktop";
import ItemsCarousel from "./ItemsCarousel";
import RequestStatus from "./RequestStatus";
import DefaultDesktopNav from "@/components/nav/DefaultDesktopNav.vue";
import MakeTransferPayment from "@/components/transfer/MakeTransferPayment.vue";

export default {
  name: 'RequestDesktop',
  mixins: [request, views],
  components: {
    MakeTransferPayment,
    DefaultDesktopNav,
    RequestStatus,
    ItemsCarousel,
    RequestInvoiceDesktop,
    RequestOptions,
    EligibilityWidget,
    RequestSchedule,
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/variables';

.container--fluid {
  margin-top: var(--nav-spacing);
  height: calc((var(--vh, 1vh) * 100) - var(--nav-spacing));
}
</style>
