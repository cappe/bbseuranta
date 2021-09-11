import Vue from 'vue/dist/vue.esm'
import App from '../src/App'
import "../register-sw"

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
