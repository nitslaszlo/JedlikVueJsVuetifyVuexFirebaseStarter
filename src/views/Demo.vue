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
            v-model="name"
            label="Name"
            placeholder="Image name"
            required /><br>
          <v-text-field
            v-model="image"
            label="URL"
            placeholder="Image URL"
            required />
          <v-btn @click="addLocation(name, image)"> Add </v-btn>
        </v-form>
      </v-flex>
      <v-flex 
        v-for="(location, index) in locations" 
        :key="index" 
        xs12 
        sm6 
        md3>
        <v-card>
          <v-img
            class="white--text"
            height="200px"
            :src="location.image">
            <v-container 
              fill-height 
              fluid>
              <v-layout fill-height>
                <v-flex 
                  xs12 
                  align-end 
                  flexbox>
                  <span class="headline">{{ location.name }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
          <v-card-title>
            <div>
              <span class="grey--text">Number {{ index + 1 }}</span><br>
              <span>{{ location.createdAt.toDate() }}</span>
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

  private addLocation(name: string, image: string): void {
    const createdAt = new Date();
    // prettier-ignore
    db.collection("locations")
      .add({ name, image, createdAt })
      .then(docRef => {
        alert(`Document written with ID: ${docRef.id}`);
      })
      .catch(error => {
        alert(`Error adding document: ${error}`);
      });
    this.name = "";
    this.image = "";
  }

  private deleteLocation(id: any): void {
    // prettier-ignore
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
    // alert("invoke: onLocationsChanged");
  }
}
</script>

<style scoped>
</style>
