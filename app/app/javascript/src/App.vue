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
            @click="onNotify"
        >
          Vinkkaa muille
        </button>

        <button
            @click="unsubscribe"
        >
          Disable Webpush
        </button>

        <div>
          <div>
            Notifications
          </div>

          <div>
            <div
              v-for="(notification, i) in notifications"
              :key="i"
            >
              <div>
                Vinkki annettu
                {{ formatDateTime(notification.created_at) }}
              </div>

              <div>
                Luettu: {{ formatDateTime(notification.read_at) }}
              </div>
            </div>
          </div>
        </div>
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
      notifications: 'sw/notifications',
    }),
  },

  watch: {
    notifications(notifications, prevNotifications) {
      if (notifications === prevNotifications) return;
      const notification_ids = notifications.map(n => n.id);
      this.readAll({ notification_ids });
    },
  },
  
  methods: {
    ...mapActions({
      subscribeToPushNotifications: 'sw/subscribeToPushNotifications',
      unsubscribePushNotification: 'sw/unsubscribePushNotification',
      notify: 'notifications/notify',
      readAll: 'notifications/readAll',
    }),

    subscribe() {
      this.subscribeToPushNotifications();
    },

    unsubscribe() {
      this.unsubscribePushNotification();
    },

    onNotify() {
      this.notify();
    },

    formatDateTime(timestamp) {
      if (!timestamp) return null;
      let date = new Date(timestamp).toLocaleString();
      date = date.replace(/\,/g, '');
      date = date.replace(/\//g, '.');
      return date;
    }
  },
}
</script>

<style scoped>

</style>
