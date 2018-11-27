<template>
  <div id="app">
    <v-app id="inspire">
      <v-toolbar app>
        <v-toolbar-title>My Firebase Demo</v-toolbar-title>
        <router-link to="/"><v-btn color="info">Login</v-btn></router-link>
        <router-link to="/demo"><v-btn color="info">Demo</v-btn></router-link>
        <router-link to="/about"><v-btn color="info">About</v-btn></router-link>
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

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
