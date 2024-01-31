<template>
  <v-card flat>
    <v-card-text class="px-6 py-16 fill-height overflow-y-auto py-6 px-8 px-md-10">
      <h2 class="mb-8 text-title" style="font-size: 1.5rem!important;">Search for any item</h2>
      <v-text-field
        v-model="query" @click:append="handleSearch(query)" class="fill-width"
        :hide-details="'auto'" prepend-inner-icon="mdi-magnify"
        placeholder="eg. iPhone 12, Hp laptop" outlined rounded
      ></v-text-field>

      <v-row class="mt-4" dense>
        <v-col cols="4">
          <v-card
            @click="handleSelect('instagram')" height="130px!important" outlined
            class="d-flex justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('instagram') }"
          >
            <div>
              <img src="/img/logos/instagram.svg" alt="" style="width: 60px">
            </div>
            <v-icon
              v-if="stores.includes('instagram')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            @click="handleSelect('jumia')" height="130px!important" outlined
            class="d-flex justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('jumia') }"
          >
            <div>
              <img src="/img/logos/jumia.svg" alt="" style="width: 80px">
            </div>
            <v-icon
              v-if="stores.includes('jumia')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            @click="handleSelect('jiji')" height="130px!important" outlined
            class="d-flex justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('jiji') }"
          >
            <div>
              <img src="/img/logos/jiji.png" alt="" style="width: 80px">
            </div>
            <v-icon
              v-if="stores.includes('jiji')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            @click="handleSelect('konga')" height="130px!important" outlined
            class="d-flex justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('konga') }"
          >
            <div>
              <img src="/img/logos/konga.png" alt="" style="width: 80px">
            </div>
            <v-icon
              v-if="stores.includes('konga')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            height="130px!important" outlined disabled
            class="d-flex flex-column justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('amazon') }"
          >
            <div>
              <img src="/img/logos/amazon.png" alt="" style="width: 80px">
            </div>
            <v-chip x-small class="mt-2">Coming soon</v-chip>
            <v-icon
              v-if="stores.includes('olist')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card
            height="130px!important" outlined disabled
            class="d-flex flex-column justify-center rounded-xl align-center fill-height py-4 position-relative"
            :class="{ 'selected': stores.includes('aliexpress') }"
          >
            <div>
              <img src="/img/logos/aliexpress.svg" alt="" style="width: 80px">
            </div>
            <v-chip x-small class="mt-2">Coming soon</v-chip>
            <v-icon
              v-if="stores.includes('olist')"
              style="position: absolute; top: 10px; left: 10px" size="30" class="green--text"
            >
              mdi-check-circle
            </v-icon>
          </v-card>
        </v-col>
      </v-row>
      <v-btn @click="handleSearch" color="primary" elevation="0" class="mt-8" rounded large>Search</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SearchModal",
  data() {
    return {
      query: this.$store.state.global.query,
      stores: this.$store.state.global.stores,
    }
  },
  methods: {
    handleSearch() {
      if (!this.query.length || !this.stores.length) return;
      this.$emit('close');
      let query = { q: this.query };
      if (this.stores.includes('jumia')) query.jumia = true;
      if (this.stores.includes('konga')) query.konga = true;
      if (this.stores.includes('jiji')) query.jiji = true;
      if (this.stores.includes('instagram')) query.instagram = true;
      this.$store.commit('global/set', { query: this.query, stores: this.stores });
      this.$router.push({ path: '/search/others', query });
    },
    handleSelect(c) {
      if (!this.stores.includes(c)) this.stores.push(c);
      else this.stores = this.stores.filter(s => s !== c);
    }
  }
}
</script>

<style scoped>
.selected {
  border: 2px solid #82d97d;
}
</style>
