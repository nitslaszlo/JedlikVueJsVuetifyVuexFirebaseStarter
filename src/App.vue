<template>
  <div id="app">
    <v-app>
      <v-toolbar app>
        <v-toolbar-title v-if="!this.$isLoggedIn">Jedlik Vuex-Firebase demo NEW</v-toolbar-title>
        <div v-if="this.$isLoggedIn" class="logo">
          <v-toolbar-title>Jedlik Vuex-Firebase demo</v-toolbar-title>
          <!-- E-mail cím kiírása ha van bejelentkezett felhasználó! -->
          <p v-if="!this.$isVerified">Bejelentkezve: {{ this.$email }}</p>
          <p v-if="this.$isVerified">Bejelentkezve: {{ this.$email }} (verified)</p>
        </div>
        <v-spacer/>
        <!-- Router link-eknél beállítva, hogy mikor jelenjenek meg (v-if-ek segítségével) -->
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="this.$isLoggedIn || this.$route.path == '/'"
          to="/"
        >Login</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="this.$isLoggedIn || this.$route.path == '/signup'"
          to="/signup"
        >SignUp</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="!this.$isLoggedIn || this.$isVerified || this.$route.path == '/verify'"
          to="/verify"
        >Verify</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="!this.$isLoggedIn || !this.$isVerified || this.$route.path == '/firebasedemo'"
          to="/firebasedemo"
        >Firebase demo</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="!this.$isLoggedIn || !this.$isVerified || this.$route.path == '/vuexdemo'"
          to="/vuexdemo"
        >Vuex demo</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="!this.$isLoggedIn || !this.$isVerified || this.$route.path == '/vuexfirebasedemo'"
          to="/vuexfirebasedemo"
        >Vuex-Firebase demo</v-btn>
        <v-btn
          color="info"
          :round="true"
          class="links"
          :disabled="!this.$isLoggedIn"
          @click="logout()"
        >LogOut</v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
      <v-footer/>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import firebase from "firebase";

@Component
export default class App extends Vue {
  // Kijelentkezés
  private logout (): void {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.$router.replace("login");
      });
  }

  // Felhasználó e-mail
  mounted () {
    this.$store.dispatch("fetchAll"); // fetchAll Action futtatása
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
