import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import FirebaseDemo from "./views/FirebaseDemo.vue";
import VuexFirebaseDemo from "./views/VuexFirebaseDemo.vue";
import Verify from "./views/Verify.vue";
import VuexDemo from "./views/VuexDemo.vue";
import firebase from "firebase";

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: "history",
  routes: [
    {
      component: Login,
      name: "login",
      path: "/"
    },
    {
      component: SignUp,
      name: "signup",
      path: "/signup"
    },
    {
      component: Verify,
      name: "verify",
      path: "/verify"
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      component: FirebaseDemo,
      name: "firebasedemo",
      path: "/firebasedemo"
      // meta: {
      //   requiresAuth: true,
      //   requiresVerify: true
      // }
    },
    {
      component: VuexFirebaseDemo,
      name: "vuexfirebasedemo",
      path: "/vuexfirebasedemo"
      // meta: {
      //   requiresAuth: true,
      //   requiresVerify: true
      // }
    },
    {
      component: VuexDemo,
      name: "vuexdemo",
      path: "/vuexdemo"
      // meta: {
      //   requiresAuth: true,
      //   requiresVerify: true
      // }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // alert(to.name);
  // Aktuális felhasználó tárolása, értéke null, ha nincs bejelentkezve

  const user = firebase.auth().currentUser;

  let verified;

  if (user) {
    verified = user.emailVerified;
    Vue.prototype.$isLoggedIn = true;
    Vue.prototype.$isVerified = verified;
    Vue.prototype.$email = user.email;
  } else {
    Vue.prototype.$isLoggedIn = false;
    Vue.prototype.$isVerified = false;
    Vue.prototype.$email = "";
  }

  // Meta-s megoldás (by Tamás Tömördi):
  // Az azonosítás igénylő (védett) oldalak meta tag-je
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // A megerősítetést igénylő oldalak meta tag-je
  // const requiresVerify = to.matched.some(record => record.meta.requiresVerify);

  // A megfelelő átirányítások abban az esetben, ha nincs meg a megfelelő jogosultság:
  // if (requiresAuth && !user) next("login");
  // else if (requiresAuth && user) {
  //   if (requiresVerify && !verified) next("verify");
  //   else if (to.name == "verify" && verified) next("demo");
  //   else if (to.name == "verify" && !verified) next();
  //   else next();
  // } else next();

  // Meták nélküli "favágó" megoldás:
  // Ha nincs bejelntkezve, de bejelentkezni vagy regisztrálni akar
  if (!user && (to.name === "signup" || to.name === "login")) {
    next();
    return;
  }
  // Ha nincs bejelntkezve, és nem akar bejelentkezni vagy regisztrálni
  if (!user && to.name !== "signup" && to.name !== "login") {
    next("login");
    return;
  }
  // Ha az e-mail cím nincs megerősítve, és nem akar megerősíteni
  if (user && !verified && to.name !== "verify") {
    next("verify");
    return;
  }
  // Ha az e-mail cím nincs megerősítve, de megerősíteni akar
  if (user && !verified && to.name === "verify") {
    next();
    return;
  }
  // bejelentkezett, megerősített e-mail, Firebase demózni akar
  if (user && verified && to.name === "firebasedemo") {
    next();
    return;
  }
  // bejelentkezett, megerősített e-mail, Vuex-Firebase demózni akar
  if (user && verified && to.name === "vuexfirebasedemo") {
    next();
    return;
  }
  // bejelentkezett, megerősített e-mail, Vuex demózni akar
  if (user && verified && to.name === "vuexdemo") {
    next();
  }
});

export default router;
