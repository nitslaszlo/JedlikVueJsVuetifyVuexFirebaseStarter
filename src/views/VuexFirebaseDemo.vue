<template>
  <v-app>
    <v-layout row wrap>
      <v-flex xs12 lg6>
        <v-layout row wrap>
          <v-flex xs6 md6 xl4>
            <v-form>
              <h2>Vuex + Firebase Demo</h2>
              <v-text-field v-model="noteText" label="Note text:" :rules="[x => x.length > 0 || 'Required field']" required />
              <br />
              <v-btn
                color="success"
                :rounded="true"
                block
                :disabled="noteText.length == 0"
                @click="
                  $store.dispatch('addNote', noteText);
                  noteText = '';
                "
                >Feljegyzés hozzáadása</v-btn
              >
            </v-form>
          </v-flex>
          <v-flex v-for="(item, index) in $store.state.note.Notes" :key="index" xs12 md6 xl4>
            <v-card class="ma-2" :color="item.editing ? 'blue lighten-4' : 'white'">
              <v-card-title>
                <div>
                  <p v-if="!item.editing || !(item.editing && item.editor == email)" class="blue--text">{{ item.text }}</p>
                  <v-text-field v-if="item.editing && item.editor == email" v-model="item.text" label="Edit note text:" required />
                  <v-btn
                    v-if="item.editing && item.editor == email"
                    color="orange"
                    @click="$store.dispatch('editNoteSave', { id: item.id, text: item.text })"
                    >Mentés</v-btn
                  >
                  <p class="ma-0">Közzétette: {{ item.creator }}</p>
                  <p class="ma-0">
                    {{
                      item.created &&
                      item.created.toDate().toLocaleDateString("hu-HU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })
                    }}
                  </p>
                  <p v-if="item.editor != ''" class="ma-0">Utolsó szerkesztő: {{ item.editor }}</p>
                  <p v-if="item.editor != ''" class="ma-0">
                    {{
                      item.edited.toDate().toLocaleDateString("hu-HU", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })
                    }}
                  </p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn text color="red" :disabled="item.editing" @click="$store.dispatch('deleteNote', item.id)">Törlés</v-btn>
                <v-btn text color="orange" :disabled="item.editing" @click="$store.dispatch('editNote', item.id)">Szerkesztés</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex lg6>
        <v-layout row wrap>
          <v-flex v-for="(i, k) in $store.state.note.Alerts" :key="k" xs12 md6 lg4 @click="$store.dispatch('removeAlert', i)">
            <v-alert class="ma-2" :value="true" type="success">{{ i }}</v-alert>
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
export default class VuexFirebaseDemo extends Vue {
  private noteText: string = ""; // új feljegyzés szövege
  private email: string = firebase.auth().currentUser!.email!;
}
</script>
