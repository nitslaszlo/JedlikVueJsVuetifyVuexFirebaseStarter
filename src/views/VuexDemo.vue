
<template>
  <div class="vuexdemo">
    <h1>Simple Vuex demo</h1>
    <h1>State wheels: {{ this.$store.state.myMod.wheels }}</h1>
    <h1>Getter getAxes: {{ this.$store.getters.getAxes }}</h1>
    <v-btn color="success" :round="true" @click="fetchNewWheels">Dispatch action</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import store from "@/store";

@Component
export default class VuexDemo extends Vue {
  private async fetchNewWheels() {
    await store.dispatch("fetchNewWheels", 2);
  }
}
</script>
