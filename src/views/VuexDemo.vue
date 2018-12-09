<template>
  <div id="app">
    <h1>Vuex + Firebase</h1>
    <p>Vuex működés szemléltetés</p>
    <p class="right">
      <button @click="opened = !opened">Feljegyzés hozzáadása</button>
    </p>
    <div 
      v-if="opened" 
      class="add">
      <h2>Feljegyzés hozzáadása</h2>
      <textarea v-model="NoteText" />
      <button
        @click="$store.dispatch('addNote', NoteText); NoteText = ''; opened = false;">Hozzáadás</button>
    </div>
    <div class="notes">
      <div 
        v-for="(item, index) in $store.state.note.Notes" 
        :key="index" 
        class="note">
        <p>Hozzáadva: {{ item.created&&item.created.toDate().toLocaleDateString("hu-HU", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}</p>
        <p>{{ item.text }}</p>
        <div 
          class="delete" 
          @click="$store.dispatch('deleteNote', item.id)">⌧</div>
      </div>
    </div>
    <div class="alerts">
      <p
        v-for="(i, k) in $store.state.note.Alerts"
        :key="k"
        @click="$store.dispatch('removeAlert', i)">{{ i }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class VuexDemo extends Vue {
  private opened: boolean = false;
  private NoteText: string = ""; // új feljegyzés szövege
  mounted() {
    this.$store.dispatch("fetchAll"); // fetchAll Action futtatása
  }
}
</script>
