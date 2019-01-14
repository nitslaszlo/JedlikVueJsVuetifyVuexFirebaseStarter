<template>
  <v-app>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 ld6 xl4>
        <v-form>
          <h2>Login with e-mail and password</h2>
          <br>
          <v-text-field v-model="email" label="E-mail address" :autofocus="true" required/>
          <v-text-field
            v-model="password"
            placeholder=" "
            type="password"
            label="Password"
            required
          />
          <br>
          <v-btn block color="success" :round="true" @click="Login()">Login</v-btn>
          <v-btn block color="info" :round="true" @click="SocialLogin(true)">Login with Google</v-btn>
          <v-btn block color="info" :round="true" @click="SocialLogin(false)">Login with Facebook</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class Login extends Vue {
  private email: string;
  private password: string;

  constructor() {
    super();
    this.email = "nits@jedlik.eu";
    this.password = "Asa12345";
    // this.password = "";
  }

  private Login() {
    firebase
      .auth() // Bejelentkezés
      .signInWithEmailAndPassword(this.email, this.password)
      .then(
        success => {
          // alert("Successful login!");
          const user = firebase.auth().currentUser;
          if (user) {
            if (user.emailVerified) {
              // Átírányítás: ha megerősített akkor a demo oldalra
              this.$router.replace("vuexfirebasedemo");
            } else {
              // Ha nem megerősített a megerősítő e-mail újraküldés oldalára
              this.$router.replace("verify");
            }
          }
        },
        err => {
          alert("Oops. " + err.message);
        }
      );
  }

  private SocialLogin(google: boolean): void {
    let provider = null;
    if (google) {
      provider = new firebase.auth.GoogleAuthProvider();
    } else {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    firebase
      .auth() // Bejelentkezés
      .signInWithPopup(provider)
      .then(
        success => {
          // alert("Successful login!");
          const user = success.user;
          if (user) {
            if (user.emailVerified) {
              // Átírányítás: ha megerősített akkor a demo oldalra
              this.$router.replace("vuexfirebasedemo");
            } else {
              // Ha nem megerősített a megerősítő e-mail újraküldés oldalára
              this.$router.replace("verify");
            }
          }
        },
        err => {
          alert("Oops. " + err.message);
        }
      );
  }
}
</script>

<style scoped>
h2 {
  margin-top: 20px;
}
</style>
