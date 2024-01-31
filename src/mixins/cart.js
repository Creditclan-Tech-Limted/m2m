export default {
  data() {
    return {
      views: {
        cart: false,
        checkout: false,
        lender: false,
      },
      lender: null,
    };
  },
  created() {
    this.$bus.$on('cart', this.showCart);
    this.getLender();
  },
  computed: {
    outright() {
      return this.$store.getters["cart/outright"]
    },
  },
  methods: {
    showCart() {
      this.showView('cart');
    },
    handleCheckout() {
      if (this.outright) this.showView('checkout');
      else this.showView('lender');
    },
    async getLender() {
      try {
        const res = await this.$http.post(
          'https://mobile.creditclan.com/api/v3/bnpl/global/settings',
          {},
          {
            headers: {
              'x-api-key':
                'WE4mwadGYqf0jv1ZkdFv1LNPMpZHuuzoDDiJpQQqaes3PzB7xlYhe8oHbxm6J228',
            },
          }
        );
        const {
          lender_id,
          lender_name,
          image,
        } = res.data.response.funding_partner;
        this.lender = {
          name: lender_name,
          id: lender_id,
          image,
        };
      } catch (e) {
        this.lender = {
          image: '/img/logos/clan.png',
          id: '40245',
          name: 'Clan',
        };
      }
    },
  },
};
