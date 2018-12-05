import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import Demo from "./views/Demo.vue";
import Verify from "./views/Verify.vue";
import About from "./views/About.vue";
import firebase from "firebase";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/verify",
      name: "verify",
      component: Verify,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/demo",
      name: "demo",
      component: Demo,
      meta: {
        requiresAuth: true,
        requiresVerify: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: About,
      meta: {
        requiresAuth: true,
        requiresVerify: true
      }
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  // alert(to.name);
  // Aktuális flehasználó tárolása, értéke null, ha nincs bejelentkezve
  const user = firebase.auth().currentUser;

  // Az azonosítás igénylő (védett) oldalak meta tag-je
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // A megerősítetést igénylő oldalak meta tag-je
  const requiresVerify = to.matched.some(record => record.meta.requiresVerify);

  let verified; // Megerősített-e az e-mail cím
  if (user) verified = user.emailVerified;

  // A megfelelő átirányítások abban az esetben, ha nincs meg a megfelelő jogosultság:
  // if (requiresAuth && !user) next("login");
  // else if (requiresAuth && user) {
  //   if (requiresVerify && !verified) next("verify");
  //   else if (to.name == "verify" && verified) next("demo");
  //   else if (to.name == "verify" && !verified) next();
  //   else next();
  // } else next();
  // if (to.name == "login") {
  //   next("login");
  //   alert("login");
  // }
  if (!user && to.name == "signup") {
    next();
    return;
  }
  if (!user && to.name == "login") {
    next();
    return;
  }
  if (user && verified && to.name == "demo") {
    next();
    return;
  }
  if (user && !verified && (to.name == "demo" || to.name == "about")) {
    next("verify");
    return;
  } else {
    next();
    return;
  }
});

export default router;
