<template>
  <v-app id="app">
    <v-main>
      <router-view/>
    </v-main>

    <CartMobile v-if="$vuetify.breakpoint.mdAndDown"/>
    <CartDesktop v-else/>

    <v-bottom-sheet v-if="$vuetify.breakpoint.smAndDown" inset max-width="500" scrollable v-model="views.search">
      <SearchModal v-if="views.search" @close="views.search = false"/>
    </v-bottom-sheet>
    <v-navigation-drawer v-else fixed right temporary v-model="views.search" width="450">
      <SearchModal v-if="views.search" @close="views.search = false"/>
    </v-navigation-drawer>

    <v-bottom-sheet
      v-if="$vuetify.breakpoint.smAndDown" v-model="views.support" max-width="500" inset persistent scrollable
    >
      <ContactSupport @close="views.support = false"/>
    </v-bottom-sheet>
    <v-navigation-drawer v-else fixed right temporary v-model="views.support" width="550">
      <ContactSupport @close="views.support = false"/>
    </v-navigation-drawer>

    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown" v-model="views.filter"
      fullscreen hide-overlay transition="dialog-bottom-transition"
    >
      <ResultsSearchFilter @close="views.filter = false"/>
    </v-dialog>
    <v-navigation-drawer v-else fixed right temporary v-model="views.filter" width="450">
      <ResultsSearchFilter @close="views.filter = false"/>
    </v-navigation-drawer>

    <Modal :value="views.help">
      <v-sheet class="fill-height pb-4 d-flex flex-column">
        <div>
          <img
            src="https://images.pexels.com/photos/5625130/pexels-photo-5625130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            width="100%" height="300px" style="object-fit: cover" alt="gift"
          />
        </div>
        <v-card-title class="text-h4 text-break px-8 mt-4" style="max-width: 400px">
          We have a special offer for you
        </v-card-title>
        <v-card-text class="px-8">
          <p class="grey--text text--darken-2 text-title">Enter your phone number below to receive it.</p>
          <div class="mt-4">
            <v-text-field label="Enter your name" hide-details></v-text-field>
          </div>
          <div class="mt-2">
            <v-text-field label="Enter your phone number" hide-details></v-text-field>
          </div>
          <v-btn outlined rounded class="mt-8">Submit</v-btn>
        </v-card-text>
      </v-sheet>
    </Modal>

    <v-snackbar :color="toast.color || ''" top v-model="toast.visible" :timeout="5000">
      {{ toast.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import CartDesktop from "./components/cart/CartDesktop";
import CartMobile from "./components/cart/CartMobile";
import views from "@/mixins/views.js";
import SearchModal from "@/components/SearchModal.vue";
import ContactSupport from "@/components/ContactSupport.vue";
import ResultsSearchFilter from "@/components/Filter.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: 'App',
  mixins: [views],
  components: {
    Modal,
    ResultsSearchFilter,
    ContactSupport,
    SearchModal,
    CartMobile,
    CartDesktop,
  },
  data() {
    return {
      views: {
        search: false,
        support: false,
        filter: false,
        help: false,
      },
      toast: {
        visible: false,
        color: 'orange',
        message: ''
      },
    }
  },
  metaInfo() {
    return 'Store'
  },
  created() {
    this.setVH();
    window.addEventListener('resize', () => this.setVH());
    this.$bus.$on('modal', (view) => this.showView(view));
    this.$bus.$on('toast', ({ message, color }) => this.showToast(message, color));
  },
  methods: {
    setVH() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${ vh }px`);
    },
    showToast(message, color = '') {
      console.log('Showing toast');
      this.toast.message = message;
      this.toast.visible = true;
      this.toast.color = color || 'red'
    },
  },
}
</script>

<style lang="scss">
@import "assets/global";

.v-main {
  @media (max-width: 960px) {
    background: rgb(236, 239, 241);
  }
}

.nav-spacing {
  padding-top: 115px;
  overflow-y: initial;
  transition: all .15s linear;
}

.nav-spacing-mobile {
  padding-top: 90px;
  overflow-y: initial;
  transition: all .15s linear;
  min-height: calc((var(--vh, 1vh) * 100));
}

.bottom-nav-spacing {
  padding-bottom: 70px !important;
}
</style>
