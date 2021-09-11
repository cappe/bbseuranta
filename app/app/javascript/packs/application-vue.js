import Vue from 'vue/dist/vue.esm'
import App from '../app/App'
import "../serviceworker-companion"

document.addEventListener('DOMContentLoaded', () => {
  new Vue({
    // router,
    // store,
    // vuetify,
    // wait: new VueWait({
    //   useVuex: true,
    // }),
    render: h => h(App),
  }).$mount('#app');

})
