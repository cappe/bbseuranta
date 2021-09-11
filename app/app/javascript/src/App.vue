<template>
  <div id="app">
    <div
      v-if="supportsWebPush"
    >
      <button
        @click="enableWebpush"
      >
        Enable Webpush
      </button>
    </div>

    <div
      v-else
    >
      Does not
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({

  }),

  computed: {
    ...mapGetters({
      supportsWebPush: 'sw/supportsWebPush',
    }),
  },
  
  methods: {
    ...mapActions({
      subscribeToPushNotifications: 'sw/subscribeToPushNotifications',
    }),

    enableWebpush() {
      this.subscribeToPushNotifications();
    },
  },
}
</script>

<style scoped>

</style>
