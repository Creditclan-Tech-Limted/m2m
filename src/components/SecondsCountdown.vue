<template>
  <span>{{ countDown }}</span>
</template>

<script>
export default {
  name: "SecondsCountdown",
  data() {
    return {
      countDown: 60
    };
  },
  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
  },
  created() {
    this.countDownTimer()
  }
};
</script>
