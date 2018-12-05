<template>
  <div id="app">
    <v-app>
      <v-toolbar app>
        <v-toolbar-title v-if="!this.$isLoggedIn">My Firebase Demo</v-toolbar-title>
        <div 
          v-if="this.$isLoggedIn" 
          class="logo">
          <v-toolbar-title>My Firebase Demo</v-toolbar-title>
          <!-- E-mal cím kiírása ha van bejelentkezett felhasználó! -->
          <p>Bejelentkezve: {{ getUserEmail() }}</p>
        </div>
        <v-spacer />
        <!-- Router link-eknél beállítva, hogy mikor jelenjenek meg (v-if-ek segítségével) -->
        <v-btn
          color="info"
          class="links"
          :disabled="this.$isLoggedIn"
          to="/">Login</v-btn>
        <v-btn
          color="info"
          class="links"
          :disabled="this.$isLoggedIn"
          to="/signup">SignUp</v-btn>
        <v-btn
          color="info"
          class="links"
          disabled="this.$isLoggedIn && this.$isVerified"
          to="/verify">Verify</v-btn>
        <v-btn
          color="info"
          class="links"
          disabled="!this.$isLoggedIn && !this.$isVerified"
          to="/demo">Demo</v-btn>
        <v-btn 
          color="info"
          class="links"
          disabled="!this.$isLoggedIn || !this.$isVerified"
          to="/about">About</v-btn>
        <v-btn 
          color="info" 
          class="links"
          :disabled="!this.$isLoggedIn"
          @click="logout()">LogOut</v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-content>
      <v-footer />
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class App extends Vue {
  // Kijelentkezés
  private logout(): void {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.replace("login");
      });
  }

  // Felhasználó e-mail
  private getUserEmail(): string | null {
    return (
      firebase.auth().currentUser!.email +
      (firebase.auth().currentUser!.emailVerified
        ? " (verified)"
        : " (NOT verified)")
    );
  }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
.logo {
  margin-top: 10px;
}
.links {
  text-decoration: none;
}
</style>
