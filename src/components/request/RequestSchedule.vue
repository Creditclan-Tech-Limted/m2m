<template>
  <v-sheet>
    <template v-if="schedule.length">
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left pl-0">Date</th>
            <th class="text-left">S/N</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Paid</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="i" v-for="(item, i) in schedule">
            <td class="pl-0">{{ item.date | date }}</td>
            <td>{{ item.serial }} of {{ schedule.length }}</td>
            <td>{{ item.amount | currency }}</td>
            <td>
              <div class="green--text" v-if="item.paid">
                <v-icon color="green">mdi-check</v-icon>
              </div>
              <div class="red--text" v-else>
                <v-icon color="red" v-if="+item.amount_paid === 0">mdi-minus</v-icon>
                <v-icon color="orange" v-if="+item.amount_paid < +item.amount && +item.amount_paid > 0">
                  mdi-dots-horizontal
                </v-icon>
                <v-icon color="green" v-if="+item.amount_paid === +item.amount">mdi-check</v-icon>
              </div>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>

    <div class="pa-10" v-else>
      <div class="text-small text-center">
        No schedule
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: "RequestSchedule",
  computed: {
    schedule() {
      return this.$store.getters['request/schedule'];
    }
  },
}
</script>
