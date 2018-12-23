import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import db from "@/firebaseApp";
import firebase, { firestore } from "firebase";

interface INote {
  id?: string;
  created: firestore.Timestamp; // FireStore beépített időformátum
  text: string;
  creator: string;
  editor: string;
  editing: boolean;
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
    db.collection("notes")
      //.where("created", ">", firestore.Timestamp.now()) // szűrés
      .orderBy("created", "asc") // rendezés
      .onSnapshot(querySnapshot => {
        // event listener
        querySnapshot.docChanges().forEach(change => {
          // végigmegy a változásokon
          let docData = change.doc.data(); // az adott elem tartalma
          // console.log(change.type + ": " + docData.text);
          let item: INote = {
            // A saját szerkezet az adathoz
            id: change.doc.id,
            created: docData.created,
            text: docData.text,
            creator: docData.creator,
            editor: docData.editor,
            editing: docData.editing
          };
          if (change.type === "added") {
            data.unshift(item); // Elem hozzáadása a lista elejéhez
            this.context.commit(
              "addAlert",
              "Elem " + item.text + " hozzáadva!"
            ); // További mutáció meghívása
          } else if (change.type === "modified") {
            for (let i = 0; i < data.length; i++)
              if (data[i].id == item.id) {
                data[i] = item;
                break;
              }
            this.context.commit(
              "addAlert",
              "Elem " + item.text + " szerkesztve!"
            ); // További mutáció meghívása
          } else if (change.type === "removed") {
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
                this.context.commit("addAlert", "Elem " + e.text + " törölve!");
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
      creator: firebase.auth().currentUser!.email!,
      editor: "",
      editing: false
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

  @Action
  editNote(id: string) {
    db.collection("notes")
      .doc(id)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let data = doc.data()!;
          if (data.editing !== true) {
            db.collection("notes")
              .doc(id)
              .set(
                {
                  editing: true,
                  editor: firebase.auth().currentUser!.email!
                },
                { merge: true }
              );
          }
        }
      });
  }

  @Action
  editNoteSave(data: { [i: string]: string }) {
    let id = data.id;
    let text = data.text;
    db.collection("notes")
      .doc(id)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let data = doc.data()!;
          if (
            data.editing === true &&
            data.editor === firebase.auth().currentUser!.email!
          ) {
            db.collection("notes")
              .doc(id)
              .set({ editing: false, text: text }, { merge: true });
          } else alert("Nem lehet menteni a változtatásokat!");
        } else alert("Nem lehet menteni a változtatásokat!");
      });
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
