<template>
  <v-app>
    <v-layout 
      row 
      wrap 
      justify-center>
      <v-flex 
        xs12 
        sm10 
        md8 
        lg6 
        xl4>
        <v-form>
          <h2>Upload new image</h2>
          <br>
          <v-text-field 
            v-model="name" 
            label="Image Name" 
            required />
          <br>
          <v-text-field 
            v-model="image" 
            label="Image URL" 
            required />
          <br>
          <v-btn 
            color="info" 
            block 
            @click="addLocation(name, image)">Add</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout 
      row 
      wrap 
      justify-center>
      <v-flex 
        v-for="(location, index) in locations" 
        :key="index" 
        xs12 
        sm6 
        md4 
        lg3 
        xl3>
        <v-card>
          <v-img 
            class="white--text image-title" 
            height="200px" 
            :src="location.image">
            <v-container 
              fill-height 
              fluid>
              <v-layout fill-height>
                <v-flex 
                  align-end 
                  flexbox>
                  <span class="headline">{{ location.name }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div>
              <span class="grey--text">Number {{ index + 1 }}</span>
              <br>
              <span>Uploaded by: {{ location.uploader }}</span>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn 
              flat 
              color="red" 
              @click="deleteLocation(location.id)">Delete</v-btn>
            <v-btn 
              flat 
              color="orange">Hide</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import firebase from "firebase";
import { db } from "./firebaseApp";

@Component({
  firestore: {
    locations: db.collection("locations")
  }
})
export default class Demo extends Vue {
  private name: string = "";
  private image: string = "";
  private locations: any = [];
  private orderedLocations: any = [];

  //Új elem hozzáadása az adatbázishoz
  private addLocation(name: string, image: string): void {
    const createdAt = new Date();
    const user = firebase.auth().currentUser;
    let uploader;
    if (user) {
      uploader = user.email; // A feltöltő (a bejelentkezett felhasználó) e-mail címe
    }

    db.collection("locations") // Elem feltöltése az adatbázisba
      .add({ name, image, createdAt, uploader })
      .then(docRef => {
        alert(`Document written with ID: ${docRef.id}`);
      })
      .catch(error => {
        alert(`Error adding document: ${error}`);
      });
    this.name = "";
    this.image = "";
  }

  //Elem törlése az adatbázisból
  private deleteLocation(id: any): void {
    db.collection("locations")
      .doc(id)
      .delete()
      .then(() => {
        alert("Document deleted!");
      })
      .catch(error => {
        alert(`Error deleting document: ${error}`);
      });
  }
  @Watch("locations")
  private onLocationsChanged(value: number, oldValue: number) {
    //alert("invoke: onLocationsChanged");
  }
}
</script>

<style scoped>
.image-title {
  text-shadow: 0px 0px 8px black;
}
</style>
