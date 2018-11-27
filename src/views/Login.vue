<template>
  <v-app>
    <v-layout 
      row 
      wrap>
      <v-flex 
        xs12 
        sm12 
        md12 
        ld12 
        xl12>
        <v-form>
          <v-text-field
            v-model="email"
            label="E-mail"
            placeholder="Your e-mail address"
            required /><br>
          <v-text-field
            v-model="password"
            label="Password"
            placeholder="Password"
            required />
          <v-btn @click="signIn()"> Login </v-btn>
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
    this.email = "nitslaszlo@gmail.com";
    this.password = "";
  }

  private signIn() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(
        user => {
          this.$router.replace("/demo");
        },
        err => {
          alert("Oops. " + err.message);
        }
      );
  }
}
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
v-text-field {
  max-width: 200px;
}
</style>
