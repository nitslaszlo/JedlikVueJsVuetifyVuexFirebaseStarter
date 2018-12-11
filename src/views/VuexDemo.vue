<template>
  <v-app>
    <v-layout 
      row 
      wrap>
      <v-flex lg6>
        <v-layout 
          row 
          wrap>
          <v-flex 
            xs6 
            md6 
            lg6>
            <v-form>
              <h2>Vuex + Firebase demo</h2>
              <v-text-field 
                v-model="NoteText" 
                label="Note text:" 
                required />
              <br>
              <v-btn
                color="info"
                block
                @click="$store.dispatch('addNote', NoteText); NoteText = '';">Feljegyzés hozzáadása</v-btn>
            </v-form>
          </v-flex>
          <v-flex 
            v-for="(item, index) in $store.state.note.Notes" 
            :key="index" 
            xs3 
            md3 
            lg3>
            <v-card class="ma-2">
              <v-card-title>
                <div>
                  <p class="blue--text">{{ item.text }}</p>
                  <p>{{ item.created&&item.created.toDate().toLocaleDateString("hu-HU", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}</p>
                  <p>Közzétette: {{ item.creator }}</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn 
                  flat 
                  color="red" 
                  @click="$store.dispatch('deleteNote', item.id)">Törlés</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex lg6>
        <v-layout 
          row 
          wrap>
          <v-flex
            v-for="(i, k) in $store.state.note.Alerts"
            :key="k"
            xs12
            md6
            lg4
            @click="$store.dispatch('removeAlert', i)">
            <v-alert 
              class="ma-2" 
              :value="true" 
              type="success">{{ i }}</v-alert>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class VuexDemo extends Vue {
  private NoteText: string = ""; // új feljegyzés szövege
  // mounted() {
  //   this.$store.dispatch("fetchAll"); // fetchAll Action futtatása
  // }
}
</script>
