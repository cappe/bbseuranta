<template>
  <div id="app">
    <div
      v-if="supportsWebPush"
    >
      <div
        v-if="hasActiveSubscription"
      >
        <div>
          Has active push subscription
        </div>

        <button
            @click="unsubscribe"
        >
          Disable Webpush
        </button>
      </div>

      <div
        v-else
      >
        <div>
          Has not active push subscription
        </div>

        <button
            @click="subscribe"
        >
          Enable Webpush
        </button>
      </div>
    </div>

    <div
      v-else
    >
      Does not support
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
      hasActiveSubscription: 'sw/hasActiveSubscription',
    }),
  },
  
  methods: {
    ...mapActions({
      subscribeToPushNotifications: 'sw/subscribeToPushNotifications',
      unsubscribePushNotification: 'sw/unsubscribePushNotification',
    }),

    subscribe() {
      this.subscribeToPushNotifications();
    },

    unsubscribe() {
      this.unsubscribePushNotification();
    }
  },
}
</script>

<style scoped>

</style>
