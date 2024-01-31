<template>
  <v-sheet v-if="item">
    <v-list class="pb-0">
      <v-list-item class="py-3">
        <v-list-item-avatar size="40">
          <ProxyImage :src="item.primary_picture" alt="Item" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            <div class="text-body-1 font-weight-bold mt-1">
              {{ (item.plan.outright || 12) | currency }} outright
            </div>
            <div class="text-body-1 font-weight-bold mt-1">
              {{ (12 || 0) | currency }}/mo for {{ (item.plan.duration || 6) }} month(s)
              <div v-if="item.plan.Price" class="mt-1">
                + {{ item.plan.Price | currency }} upfront
              </div>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="$emit('close')" color="red" icon outlined>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item class="px-6 py-10">
        <!-- <div class="fill-width">
          <p class="text-title">Plan includes:</p>
          <div class="border rounded-lg">
            <div v-for="(item, i) of item.plan.items" :key="i" class="border-bottom px-4 py-2">
              {{ item.desc }}
            </div>
          </div>
        </div> -->
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-card-actions class="px-6">
      <v-btn @click="remove(item)" text>
        Remove item from cart
      </v-btn>
    </v-card-actions>



  </v-sheet>
</template>
<script>
import ProxyImage from "../ProxyImage";

export default {
  name: 'CartListItemContent',
  components: { ProxyImage },
  props: {
    item: {
      required: true
    },
  },
  methods: {
    remove(item) {
      this.$store.commit('cart/removeItem', item.id);
      this.$emit('close');
    }
  }
}
</script>



