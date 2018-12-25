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

// There may be data you’d like to use in many components,
// but you don’t want to pollute the global scope.
// In these cases, you can make them available to each Vue instance
// by defining them on the prototype:
Vue.prototype.$isLoggedIn = false;
Vue.prototype.$isVerified = false;
// Now $isLoggedIn and $isVerified are available on all Vue instances, even before creation.

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
