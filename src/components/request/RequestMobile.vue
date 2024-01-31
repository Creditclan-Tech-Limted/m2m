<template>
  <div class="fill-height">
    <v-container class="d-flex flex-column bottom-nav-spacing px-0 py-0 fill-height">
      <RequestInvoiceMobile @open="showView($event)"/>
    </v-container>

    <v-bottom-sheet inset max-width="500" v-model="views.schedule">
      <v-sheet class="px-6 py-10">
        <div class="text-h6 mb-8">Schedule</div>
        <RequestSchedule :schedule="request.request_schedule" @close="showView()"/>
      </v-sheet>
    </v-bottom-sheet>

    <v-bottom-sheet inset max-width="500" v-model="views.eligibility">
      <EligibilityWidget v-if="views.eligibility" @done="reset()" @cancel="views.eligibility = false"/>
    </v-bottom-sheet>

    <v-bottom-sheet inset max-width="500" v-model="views.payment">
      <MakeTransferPayment
        :amount="$store.getters['request/totalOutright']"
        :name="$store.state.customer.personal.full_name"
        :phone="$store.state.customer.personal.phone"
        @cancel="closeViews()"
        @done="handlePaymentDone($event)"
      />
    </v-bottom-sheet>

    <BottomNav/>
  </div>
</template>

<script>
import RequestSchedule from "./RequestSchedule";
import request from "../../mixins/request";
import views from "../../mixins/views";
import EligibilityWidget from "@/components/request/EligibilityWidget";
import RequestInvoiceMobile from "./RequestInvoiceMobile";
import BottomNav from "@/components/BottomNav.vue";
import MakeTransferPayment from "@/components/transfer/MakeTransferPayment.vue";

export default {
  name: 'RequestMobile',
  mixins: [request, views],
  components: {
    MakeTransferPayment,
    BottomNav,
    RequestInvoiceMobile,
    EligibilityWidget,
    RequestSchedule,
  }
}
</script>
