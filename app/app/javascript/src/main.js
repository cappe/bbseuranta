import Vue from 'vue/dist/vue.esm'
import { register } from 'register-service-worker'

import App from './App';
import store from './store';

if (navigator.serviceWorker) {
    register('/serviceworker.js', {
        registrationOptions: { scope: './' },

        async registered(reg) {
            await store.dispatch('sw/registered', { reg });
        },

        async updated(reg) {
            await store.dispatch('sw/updated', { reg });
        },

    })
}

document.addEventListener('DOMContentLoaded', () => {
    new Vue({
        store,
        render: h => h(App),
    }).$mount('#app');
})
