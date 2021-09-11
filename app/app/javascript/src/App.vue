<template>
  <div id="app">
    <div class="content">
      <div
          style="text-align: center; margin-top: 42px; margin-bottom: 32px;"
      >
        <img
            src="bell-96x96.png"
            style="max-width: 60px;"
        >
      </div>

      <h1>
        BB 24/7 seuranta
      </h1>

      <div
        style="text-align: center; margin: 24px 0;"
      >
        Tila:
        <span
          :style="{
            color: hasActiveSubscription ? 'teal' : 'initial',
          }"
        >
          {{ hasActiveSubscription ? 'Ilmoitukset käytössä ✓' : 'Ilmoitukset ei käytössä' }}
        </span>
      </div>

      <div
          v-if="!hasActiveSubscription"
          class="features"
      >
        <div
            class="feature"
        >
          <div>
            Vastaanota ilmoitus, kun talossa tapahtuu.
          </div>
        </div>

        <div
            class="feature"
        >
          <div>
            Vinkkaa muille, kun talossa tapahtuu.
          </div>
        </div>
      </div>

      <div
          v-if="supportsWebPush"
      >
        <div
            v-if="hasActiveSubscription"
            style="padding-bottom: 28px;"
        >
          <div
              style="text-align: center; margin-top: 28px;"
          >
            <p
                style="
                text-transform: uppercase;
                font-size: 14px;
                font-weight: bold;
                letter-spacing: 1px;
                max-width: 200px;
                margin: 0 auto;
              "
            >
              Tapahtuuko BB:ssä? Vinkkaa siitä muille:
            </p>

            <button
                @click="onNotify"
                class="btn-large"
                style="margin: 24px 0;"
            >
              Vinkkaa seuraajia
            </button>

            <div
                style="max-width: 200px; margin: 0 auto;"
            >
              Järjestelmässä on spämmiesto, joten käytäthän tätä harkiten.
            </div>
          </div>

          <hr
              style="margin: 48px 0;"
          >

          <div
              style="text-align: center;"
          >
            <h2
                style="margin-top: 0; margin-bottom: 12px;"
            >
              Aiemmat ilmoitukset
            </h2>

            <div
                style="font-size: 12px; margin-bottom: 20px;"
            >
              (uusin ensin)
            </div>

            <div
                class="notifications"
            >
              <div
                  v-for="(notification, i) in notifications"
                  :key="i"
                  class="notification"
                  :class="{
                    notification: true,
                    unread: notification.read_at === null
                  }"
              >
                <table>
                  <tbody>
                  <tr>
                    <th
                        style="text-align: left;"
                    >
                      Vinkki lähetetty
                    </th>

                    <td
                        style="padding-left: 16px;"
                    >
                      {{ formatDateTime(notification.created_at) }}
                    </td>
                  </tr>

                  <tr>
                    <th
                        style="text-align: left;"
                    >
                      Nähnyt
                    </th>

                    <td
                        style="padding-left: 16px;"
                    >
                      {{ formatDateTime(notification.read_at) || '—' }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr
              style="margin: 28px 0 48px;"
          >

          <div
              style="text-align: center; margin: 24px 0;"
          >
            <button
                @click="unsubscribe"
                class="btn-text"
                style="color: red;"
            >
              Poista ilmoitukset käytöstä
            </button>
          </div>
        </div>

        <div
            v-else
            style="text-align: center;"
        >
          <button
              @click="subscribe"
              class="btn-large"
              style="margin-bottom: 16px;"
          >
            Aktivoi ilmoitukset
          </button>

          <div>
            Selain kysyy sinulta vielä vahvistusta.
          </div>
        </div>
      </div>

      <div
          v-else
          style="text-align: center; color: red;"
      >
        Valitettavasti laitteesi tai selaimesi ei tue ilmoituksia.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
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
      const notification_ids = notifications
          .filter(n => n.read_at === null)
          .map(n => n.id);

      if (notification_ids.length <= 0) return;

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
.content {
  max-width: 500px;
  margin: 0 auto;
}

h1 {
  font-size: 42px;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 0;
}

h2 {
  margin-top: 12px;
  color: #2E2F30;
}

.features {
  display: flex;
  margin: 24px 0;
  color: #2E2F30;
}

.feature {
  text-align: center;
  margin: 0 auto;
  font-size: 20px;
  padding: 12px;
}

button.btn-large {
  padding: 20px 32px;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: teal;
  border: none;
  color: white;
}

button.btn-text {
  border: none;
  background: transparent;
}

.notifications {
  max-width: 300px;
  margin: 0 auto;
}

.notification {
  padding: 24px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

.notification:last-of-type {
  border-bottom: none;
}

.notification.unread {
  background-color: lightblue;
}
</style>
