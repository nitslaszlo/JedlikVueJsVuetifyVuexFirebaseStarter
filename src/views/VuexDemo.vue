<template>
  <v-app>
    <v-layout 
      row 
      wrap>
      <v-flex 
        xs12
        lg6>
        <v-layout 
          row 
          wrap>
          <v-flex 
            xs6 
            md6 
            xl4>
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
            xs12
            md6
            xl4>
            <v-card 
              class="ma-2" 
              :color="item.editing ? 'blue lighten-4' : 'white'">
              <v-card-title>
                <div>
                  <p 
                    v-if="!item.editing || !(item.editing && item.editor == email)" 
                    class="blue--text">{{ item.text }}</p>
                  <v-text-field
                    v-if="item.editing && item.editor == email" 
                    v-model="item.text" 
                    label="Edit note text:" 
                    required />
                  <v-btn 
                    v-if="item.editing && item.editor == email"
                    color="orange"
                    @click="$store.dispatch('editNoteSave', {id: item.id, text: item.text})">Mentés</v-btn>
                  <p class="ma-0">{{ item.created&&item.created.toDate().toLocaleDateString("hu-HU", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }}</p>
                  <p class="ma-0">Közzétette: {{ item.creator }}</p>
                  <p 
                    v-if="item.editor != ''"
                    class="ma-0">Utolsó szerkesztő: {{ item.editor }}</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn 
                  flat 
                  color="red" 
                  :disabled="item.editing"
                  @click="$store.dispatch('deleteNote', item.id)">Törlés</v-btn>
                <v-btn 
                  flat 
                  color="orange"
                  :disabled="item.editing"
                  @click="$store.dispatch('editNote', item.id)">Szerkesztés</v-btn>
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
import firebase from "firebase";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class VuexDemo extends Vue {
  private NoteText: string = ""; // új feljegyzés szövege
  // mounted() {
  //   this.$store.dispatch("fetchAll"); // fetchAll Action futtatása
  // }

  private email: string = firebase.auth().currentUser!.email!;
}
</script>
