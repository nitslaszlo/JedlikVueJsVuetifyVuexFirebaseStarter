import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Vuetify from "vuetify";
import VueFire from "vuefire";
import "vuetify/dist/vuetify.min.css";
import store from "./store";
import firebase from "firebase";

Vue.use(Vuetify, {});
Vue.use(VueFire);

Vue.config.productionTip = false;

Vue.prototype.$isLoggedIn = false;
Vue.prototype.$isVerified = false;

// onAuthStateChanged: Bejelentkezéskor és kijelentkezéskor fut le
firebase.auth().onAuthStateChanged(user => {
  user = firebase.auth().currentUser;
  // Bejelentkezés és megerősítés ellenőrzése és tárolása
  // ha a user nem null, akkor be van jelenkezve
  if (user) {
    Vue.prototype.$isLoggedIn = true;
    Vue.prototype.$isVerified = user.emailVerified;
  } else {
    // ha a user == null
    Vue.prototype.$isLoggedIn = false;
    Vue.prototype.$isVerified = false;
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
