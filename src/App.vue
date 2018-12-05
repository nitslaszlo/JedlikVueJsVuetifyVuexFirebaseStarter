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
        <router-link
          v-if="this.$isLoggedIn && !this.$isVerified"
          class="links" 
          to="/verify">
          <v-btn color="info">Verify</v-btn>
        </router-link>
        <router-link 
          v-if="!this.$isLoggedIn"
          class="links"
          to="/">
          <v-btn color="info">Login</v-btn>
        </router-link>
        <router-link 
          v-if="!this.$isLoggedIn"
          class="links"
          to="/signup">
          <v-btn color="info">SignUp</v-btn>
        </router-link>
        <router-link 
          
          class="links"
          to="/demo">
          <v-btn color="info">Demo</v-btn>
        </router-link>
        <router-link 
          v-if="this.$isLoggedIn && this.$isVerified"
          class="links"
          to="/about">
          <v-btn color="info">About</v-btn>
        </router-link>
        <v-btn 
          v-if="this.$isLoggedIn"
          class="links"
          color="info" 
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
