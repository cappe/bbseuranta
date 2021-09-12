<template>
  <div id="app">
    <div class="content">
      <div
          style="text-align: center; margin-top: 42px; margin-bottom: 32px; height: 64px;"
      >
        <img
            src="bell-96x96.png"
            style="max-width: 60px;"
        >
      </div>

      <h1
          style="margin-bottom: 0; letter-spacing: 4px;"
      >
        BB 24/7 seuranta
      </h1>

      <h2
          style="margin-top: 4px;"
      >
        Kun haluat nähdä ne mehukkaimmat hetket livenä.
      </h2>

      <div
          v-if="loading"
          style="text-align: center; margin-top: 48px;"
      >
        <div class="lds-dual-ring" />
      </div>

      <template
        v-else
      >
        <div
            style="text-align: center; margin: 36px 0 24px;"
        >
          Tila:
          <span
              :style="{
            color: hasActiveChannel ? 'teal' : 'initial',
          }"
          >
          {{ hasActiveChannel ? 'Ilmoitukset käytössä ✓' : 'Ilmoitukset ei käytössä' }}
        </span>
        </div>

        <div
            v-if="!hasActiveChannel"
            class="features"
        >
          <div
              class="feature"
          >
            <div>
              Vastaanota ilmoitus, kun talossa tapahtuu.
            </div>
          </div>

          <hr>

          <div
              class="feature"
          >
            <div>
              Vinkkaa muita, kun talossa tapahtuu.
            </div>
          </div>
        </div>

        <div
            v-if="supportsWebPush || hasActiveChannel"
        >
          <div
              v-if="hasActiveChannel"
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
                  style="margin: 24px 0; cursor: pointer;"
              >
                Lähetä ilmoitus
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
              <h3
                  style="margin-top: 0; margin-bottom: 12px;"
              >
                Aiemmat ilmoitukset
              </h3>

              <div
                  style="font-size: 12px; margin-bottom: 20px;"
              >
                (uusin ensin)
              </div>

              <div
                  class="notifications"
              >
                <template
                    v-if="notifications.length > 0"
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
                </template>

                <div
                    v-else
                    style="font-style: italic;"
                >
                  Ei ilmoituksia.
                </div>
              </div>
            </div>

            <hr
                style="margin: 48px 0;"
            >

            <div
                style="text-align: center; margin: 24px 0;"
            >
              <button
                  @click="unsubscribe"
                  class="btn-text"
                  style="color: red; cursor: pointer;"
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
                style="margin-bottom: 16px; cursor: pointer;"
            >
              Aktivoi ilmoitukset
            </button>

            <div
                style="font-size: 12px;"
            >
              Selain kysyy sinulta vielä vahvistusta.
            </div>
          </div>
        </div>

        <div
            v-if="!hasActiveChannel && !supportsWebPush"
            style="text-align: center;"
        >
          <div
              style="color: red; margin-bottom: 24px;"
          >
            Valitettavasti laitteesi tai selaimesi ei tue push-ilmoituksia.
          </div>

          <div
              v-if="!emailSent"
          >
            <h3
                style="margin-bottom: 12px;"
            >
              Vastaanota ilmoitukset sähköpostiin
            </h3>

            <div>
              <form
                  @submit.prevent="subscribe"
              >
                <label>
                  Syötä sähköpostiosoitteesi:

                  <div
                      style="margin: 6px 0 12px;"
                  >
                    <input
                        v-model="email"
                        style="
                      padding: 8px;
                      min-width: 260px;
                    "
                    >
                  </div>
                </label>

                <button
                    type="submit"
                    class="btn-large"
                    style="cursor: pointer;"
                >
                  Tallenna
                </button>
              </form>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    email: null,
    emailSent: false,
    loading: true,
  }),

  computed: {
    ...mapGetters({
      supportsWebPush: 'sw/supportsWebPush',
      hasActiveSubscription: 'sw/hasActiveSubscription',
      hasActiveEmail: 'sw/hasActiveEmail',
      notifications: 'sw/notifications',
      currentUser: 'sw/currentUser',
    }),

    hasActiveChannel() {
      return this.hasActiveSubscription || this.hasActiveEmail;
    },
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

  async mounted() {
    if (this.userId()) {
      const success = await this.loadUser(this.userId());
      if (!success) {
        this.removeUserId();
      }
    }

    this.$nextTick(() => {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
  },

  methods: {
    ...mapActions({
      subscribeToPushNotifications: 'sw/subscribeToPushNotifications',
      unsubscribePushNotification: 'sw/unsubscribePushNotification',
      notify: 'notifications/notify',
      readAll: 'notifications/readAll',
      createUser: 'sw/createUser',
      loadUser: 'sw/loadUser',
      destroyUser: 'sw/destroyUser',
    }),

    async subscribe() {
      const subscription = await this.subscribeToPushNotifications();
      await this.saveUser(subscription);

      if (this.hasActiveSubscription) {
        window.fathom.trackGoal('BWB7HYCE', 0); // Subscribe to Webpush
      }

      if (this.hasActiveEmail) {
        window.fathom.trackGoal('JOZLR9CU', 0); // Subscribe to Email
      }
    },

    async unsubscribe() {
      if (this.hasActiveSubscription) {
        window.fathom.trackGoal('YAU4EH9R', 0); // Unsubscribe from Webpush
      }

      if (this.hasActiveEmail) {
        window.fathom.trackGoal('IBNDHEWD', 0); // Unsubscribe from Email
      }

      await this.unsubscribePushNotification();
      await this.destroyUser();
      this.removeUserId();
    },

    onNotify() {
      this.notify();
      window.fathom.trackGoal('8ENS1ZHH', 0);
    },

    formatDateTime(timestamp) {
      if (!timestamp) return null;
      let date = new Date(timestamp).toLocaleString();
      date = date.replace(/\,/g, '');
      date = date.replace(/\//g, '.');
      return date;
    },

    async saveUser(subscription = null) {
      let payload = {
        user: {
          email: this.email,
        },
      };

      if (subscription) {
        payload = {
          user: {
            ...payload.user,
            endpoint: subscription.endpoint,
            expirationTime: subscription.expirationTime,
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
          }
        }
      }

      const success = await this.createUser(payload);
      if (success) this.addUserId();
      this.email = null;
    },

    userId() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      const id = params.get('id');
      return id;
    },

    addUserId() {
      window.history.replaceState({}, document.title, `?id=${this.currentUser.id}`);
    },

    removeUserId() {
      window.history.replaceState({}, document.title, '/');
    },
  },
}
</script>

<style>
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
  font-size: 16px;
  text-align: center;
  letter-spacing: 2px;
  color: #000000bf;
}

h3 {
  margin-top: 12px;
  color: #2E2F30;
}

.features {
  max-width: 400px;
  display: flex;
  margin: 32px auto;
  color: #2E2F30;
}

.feature {
  text-align: center;
  margin: 0 auto;
  font-size: 16px;
  padding: 8px;
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

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 32px;
  height: 32px;
  margin: 8px;
  border-radius: 50%;
  border: 3px solid orange;
  border-color: orange transparent orange transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
