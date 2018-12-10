import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import db from "@/firebaseApp";
import firebase, { firestore } from "firebase";

interface INote {
  id?: string;
  created: firestore.Timestamp; // FireStore beépített időformátum
  text: string;
  creator: string;
}

@Module
export default class Note extends VuexModule {
  Notes: INote[] = [];
  Alerts: string[] = [];

  @Mutation
  fetch(elements: INote[]) {
    this.Notes = elements;
    this.Alerts = [];
  }

  @Mutation
  addAlert(text: string) {
    this.Alerts.push(text);
  }

  /**
   * 'Lekérdezést' hajt végre a FireStore adatbázison,
   * egy változásfigyelőt aktivál, hogy változás esetén
   * automatikusan változzon a tartalom
   * A mutáció referencia alapján kapja meg a változót az elemekkel,
   * így ha az adatok változnak, a Mutáció is
   */
  @Action({ commit: "fetch" })
  fetchAll() {
    let data: INote[] = [];
    let cont = this.context; // szükséges, a belső funkciókból, ebben a nézetben való végrehajtásokhoz
    db.collection("notes")
      //.where("created", ">", firestore.Timestamp.now()) // szűrés
      .orderBy("created", "asc") // rendezés
      .onSnapshot(querySnapshot => {
        // event listener
        querySnapshot.docChanges().forEach(change => {
          // végigmegy a változásokon
          /* eslint no-console: */
          console.log(change.type);
          let docData = change.doc.data(); // az adott elem tartalma
          let item: INote = {
            // A saját szerkezet az adathoz
            id: change.doc.id,
            created: docData.created,
            text: docData.text,
            creator: docData.creator
          };
          if (change.type === "added") {
            data.unshift(item); // Elem hozzáadása a lista elejéhez
            cont.commit("addAlert", "Elem " + item.text + " hozzáadva!"); // További mutáció meghívása
          }
          //if (change.type === "modified") {}
          else if (change.type === "removed") {
            let index = 0;
            let breakExp = {};
            try {
              data.forEach(i => {
                if (i.id == item.id) {
                  breakExp = i;
                  throw breakExp; // a forEachből csak Exceptionnal lehet kilépni
                }
                index++;
              });
            } catch (e) {
              if (e === breakExp) {
                cont.commit("addAlert", "Elem " + e.text + " törölve!");
                data.splice(index, 1);
              }
            }
          }
        });
      });
    return data;
  }

  /**
   * Feljegyzés hozzáadásához való Action, ami nem hív meg Mutációt,
   * mert a FireStore a változásokat a fetchAllban követi
   * @param text feljegyzés szövege
   */
  @Action
  addNote(text: string) {
    let el: INote = {
      created: firestore.Timestamp.now(),
      text,
      creator: firebase.auth().currentUser!.email!
    };
    db.collection("notes").add(el);
    // lehetőség van a beszúrt elem ID-jét lekérdezni
    /*.then(function(docRef) {
        el.id = docRef.id;
      })*/
  }

  /**
   * Kitörli az elemet a FireStoreból, mint a hozzáadásnál, itt sincs Mutáció{}
   * @param item törlendő elem id-je
   */
  @Action
  deleteNote(id: string) {
    db.collection("notes")
      .doc(id)
      .delete();
  }

  @Mutation
  removeAlertMutation(id: number) {
    this.Alerts.splice(id, 1);
  }

  @Action({ commit: "removeAlertMutation" })
  removeAlert(id: number) {
    return id;
  }
}
