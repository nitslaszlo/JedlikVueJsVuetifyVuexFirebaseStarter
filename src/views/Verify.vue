<template>
  <v-app>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10 md8 ld6 xl4>
        <v-form>
          <h2>E-mail hasn't verified yet!</h2>
          <br />
          <v-btn block color="success" :rounded="true" @click="reSendEmail()">Send Verification E-mail!</v-btn>
          <br />
          <v-btn block color="success" :rounded="true" @click="testVerification()">I successfully verified my email address!</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class Verify extends Vue {
  private reSendEmail(): void {
    const user = firebase.auth().currentUser;
    if (user) {
      // Megerősítő e-mail újra küldése
      user.sendEmailVerification().then(
        succes => {
          alert("Verification e-mail sent!");
        },
        () => {
          alert("Failed to send verifiation e-mail!");
        }
      );
    }
  }

  private async testVerification() {
    const user = firebase.auth().currentUser;
    if (user) {
      // Felhasználói adatok ujratöltése
      await user.reload().then(() => {
        if (user.emailVerified) {
          // Átírányítás: ha megerősített, akkor a vuex-firebase demo oldalra
          Vue.prototype.$isLoggedIn = true; // ?? nem jelentek meg a navbar-on a gombok
          Vue.prototype.$isVerified = true;
          this.$router.replace("vuexfirebasedemo");
        } else {
          alert("Verification error!");
        }
      });
    }
  }
}
</script>

<style scoped>
v-text-field {
  max-width: 200px;
}
h2 {
  margin-top: 20px;
}
</style>
