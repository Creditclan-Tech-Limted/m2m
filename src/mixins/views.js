export default {
  data() {
    return {
      views: {}
    }
  },
  methods: {
    showView(view) {
      this.closeViews()
      if (view) this.views[view] = true
    },
    closeViews() {
      Object.keys(this.views).forEach(key => {
        this.views[key] = false
      });
    },
  }
}
