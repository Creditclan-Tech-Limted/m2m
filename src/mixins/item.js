import { getPlan, nPercentOf, roundToNearestTen } from "@/lib/utils.js";

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return ({
      liked: false,
    });
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.liked = (JSON.parse(localStorage.getItem('likes')) || []).includes(this.item.id);
    },
    async addView() {
      const views = JSON.parse(localStorage.getItem('views')) || [];
      if (!views.includes(this.item.id)) {
        await this.$http.get(`/item/${ this.item.id }/view`);
        views.push(this.item.id);
        localStorage.setItem('views', JSON.stringify(views));
      }
    },
    async addLike() {
      if (!this.liked) {
        const res = await this.$http.get(`/item/${ this.item.id }/like`);
        if (res.data.status === true) {
          const likes = JSON.parse(localStorage.getItem('likes')) || []
          likes.push(this.item.id);
          localStorage.setItem('likes', JSON.stringify(likes))
          this.liked = true;
          this.item.likes++
        }
      }
    },
  },
  computed: {
    rating() {
      return Math.round(this.item.ratings / this.item.total_ratings)
    },
    plan() {
      return getPlan({ credit: this.credit, upfront: this.upfront, duration: 2 });
    },
    outright() {
      return roundToNearestTen(((5 * 100) / +this.item.price) + +this.item.price);
    },
    upfront() {
      return roundToNearestTen(nPercentOf(60, +this.item.price));
    },
    credit() {
      return roundToNearestTen(nPercentOf(40, +this.item.price));
    },
    available() {
      return this.plan.monthly < 3000000 && this.plan.monthly > 1
    },
  },
};
