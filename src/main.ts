import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuetify from "vuetify";
import VueFire from "vuefire";
import "vuetify/dist/vuetify.min.css";
import store from "./store";

Vue.use(Vuetify, {});
Vue.use(VueFire);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
