<template>
  <div id="app">
    <h1>
      BB 24/7 seuranta
    </h1>

    <p>
      Seuraatko BB 24/7:aa? Etkö näe sieltä koskaan mitään mehukasta katsottavaa?
    </p>

    <p>
      Ei hätää, ratkaisu on tässä:
    </p>

    <ol>
      <li>
        Ota ilmoitukset käyttöön
      </li>

      <li>
        Saa ilmoitus, kun toinen katsoja vinkkaa mehukkaasta sisällöstä
      </li>

      <li>
        Vinkkaa muille, kun näet mielenkiintoista katsottavaa
      </li>
    </ol>

    <div
      v-if="supportsWebPush"
    >
      <div>
        Tila: {{ hasActiveSubscription ? 'Ilmoitukset käytössä' : 'Ilmoitukset ei käytössä' }}
      </div>

      <div
        v-if="hasActiveSubscription"
      >
        <div>
          <div>
            Kun näet BB 24/7:sta mielenkiintoista katsottavaa, vinkkaa siitä
            muille seuraajille klikkaamalla tätä painiketta:
          </div>

          <button
              @click="onNotify"
          >
            Vinkkaa mehukkaasta sisällöstä
          </button>

          <div>
            Huomaathan, että vastuu on suuri. Käytä sitä harkiten.
          </div>
        </div>

        <div>
          <div>
            Voit ottaa push-ilmoitukset pois käytöstä tällä painikkeella:
          </div>

          <button
              @click="unsubscribe"
          >
            Poista push-ilmoitukset käytöstä
          </button>
        </div>

        <div>
          <div>
            Aiemmat ilmoitukset (uusin ensin)
          </div>

          <div>
            <div
              v-for="(notification, i) in notifications"
              :key="i"
            >
              <div>
                Vinkki annettu {{ formatDateTime(notification.created_at) }}
              </div>

              <div>
                Nähty: {{ formatDateTime(notification.read_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
      >
        <button
            @click="subscribe"
        >
          Aktivoi push-ilmoitukset
        </button>

        <div>
          Selain kysyy sinulta vielä vahvistusta.
        </div>
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

</style>
