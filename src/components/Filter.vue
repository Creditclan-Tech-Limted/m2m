<template>
  <v-card>
    <v-card-text class="py-8">
      <div class="d-flex flex-column">
        <div class="d-flex align-center justify-space-between mb-6">
          <h3>Filter</h3>
          <v-btn @click="$emit('close')" color="red" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div>
          <form>
            <ValidationProvider name="category_id" v-slot="{ errors }">
              <div>
                <p class="mb-6 black--text">Select category</p>
                <v-radio-group
                  v-if="categories.length"
                  :error-messages="errors" class="mt-2" hide-details row
                  v-model="values.category_id"
                >
                  <v-row dense>
                    <v-col cols="6" v-for="cat in categories" :key="cat.value">
                      <v-radio :value="cat.value" :label="cat.text"></v-radio>
                    </v-col>
                  </v-row>
                </v-radio-group>
                <div v-else class="d-flex align-center">
                  <v-progress-circular class="mr-3" indeterminate :width="3" :size="16" color="gray"/>
                  Loading categories..
                </div>
              </div>
            </ValidationProvider>

            <div v-if="keywords.length" class="mt-6">
              <p class="mb-6 black--text">What are you interested in?</p>
              <v-select
                v-model="values.keywords" :items="keywords" chips label="Select one or more" multiple dense hide-details
              >
              </v-select>
            </div>

            <div class="mt-6">
              <p class="ma-0 mb-3 black--text">Price range</p>
              <v-row>
                <v-col>
                  <ValidationProvider name="minimum_amount" v-slot="{ errors }">
                    <v-text-field
                      :error-messages="errors"
                      type="number"
                      label="Minimum amount"
                      v-model="values.minimum_amount"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col>
                  <ValidationProvider name="maximum_amount" v-slot="{ errors }">
                    <v-text-field
                      :error-messages="errors"
                      type="number"
                      label="Maximum amount"
                      v-model="values.maximum_amount"
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </div>

            <div class="mt-4 pt-4 border-top" v-if="values.on_credit === 1">
              <p class="ma-0">Monthly installments</p>
              <v-slider :thumb-size="50" dense max="12" step="1" thumb-label v-model.number="values.max_no_of_months">
              </v-slider>
              <p class="ma-0">Monthly repayment amount</p>
              <v-slider
                :thumb-size="50" dense max="500000" step="1000" thumb-label v-model.number="values.max_monthly_amount"
              >
              </v-slider>
            </div>

            <div class="d-flex mt-10">
              <v-btn @click="submit" class="flex-grow-1" color="primary" elevation="0">
                Filter
              </v-btn>
            </div>
          </form>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import categories from "@/lib/categories.js";

export default {
  name: "ResultsSearchFilter",
  data() {
    return {
      categories: [],
      subcategories: [],
      values: {
        category_id: 4,
        minimum_amount: 0,
        maximum_amount: 0,
        keywords: ''
      },
    }
  },
  computed: {
    keywords() {
      return categories.find(c => c.id === this.values.category_id)?.keyword?.split(', ') ?? [];
    },
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const res = await this.$http.get(`item/categories`);
      this.categories = res.data.data.map(d => ({ text: d.name, value: d.id }));
    },
    submit() {
      this.handleFilter();
      this.$emit('close');
    },
    handleFilter() {
      const { minimum_amount, maximum_amount, keywords, category_id } = this.values;
      const q = keywords ? keywords.join(', ') : categories.find(c => `${ c.id }` === `${ category_id }`)?.keyword;
      const params = { q, minimum_amount, maximum_amount };
      const query = Object.keys(params).reduce((acc, key) => {
        if (params[key]) acc[key] = params[key];
        return acc;
      }, {});
      this.$router.push({ path: '/search', query });
    },
  },
  watch: {
    current(v) {
      if (v) {
        this.values.category_id = this.current.id;
      }
    }
  }
}
</script>
