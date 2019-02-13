import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import db from "@/firebaseApp";
import firebase, { firestore } from "firebase";

interface INote {
  id?: string;
  created: firestore.Timestamp; // FireStore beépített időformátuma
  text: string;
  creator: string;
  editor: string;
  editing: boolean;
  edited: firestore.Timestamp;
}

@Module
export default class Note extends VuexModule {
  public Notes: INote[] = [];
  public Alerts: string[] = [];

  @Mutation
  public fetch(elements: INote[]) {
    this.Notes = elements;
    this.Alerts = [];
  }

  @Mutation
  public addAlert(text: string) {
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
  public fetchAll() {
    const data: INote[] = [];
    db.collection("notes")
      // .where("created", ">", firestore.Timestamp.now()) // szűrés
      .orderBy("created", "asc") // rendezés
      .onSnapshot(querySnapshot => {
        // event listener
        querySnapshot.docChanges().forEach(change => {
          // végigmegy a változásokon
          const docData = change.doc.data(); // az adott elem tartalma
          // console.log(change.type + ": " + docData.text);
          const item: INote = {
            // A saját szerkezet az adathoz
            id: change.doc.id,
            created: docData.created,
            text: docData.text,
            creator: docData.creator,
            editor: docData.editor,
            editing: docData.editing,
            edited: docData.edited
          };
          if (change.type === "added") {
            data.unshift(item); // Elem hozzáadása a lista elejéhez
            this.context.commit(
              "addAlert",
              "Elem " + item.text + " hozzáadva!"
            ); // További mutáció meghívása
          } else if (change.type === "modified") {
            data[data.findIndex(x => x.id === item.id)] = item;
            this.context.commit(
              "addAlert",
              "Elem " + item.text + " szerkesztve!"
            ); // További mutáció meghívása
          } else if (change.type === "removed") {
            const törlendőIndexe = data.findIndex(x => x.id === item.id);
            if (törlendőIndexe !== -1) {
              this.context.commit(
                "addAlert",
                "Elem " + data[törlendőIndexe].text + " törölve!"
              );
              data.splice(törlendőIndexe, 1);
            }
          }
        });
      });
    return data;
  }

  /**
   * Feljegyzés hozzáadásához való Action, ami nem hív meg Mutációt,
   * mert a FireStore a változásokat a fetchAllban követi
   * @param textNote feljegyzés szövege
   */
  @Action
  public addNote(textNote: string) {
    const newNote: INote = {
      created: firestore.Timestamp.now(),
      text: textNote,
      creator: firebase.auth().currentUser!.email!,
      editor: "",
      editing: false,
      edited: firestore.Timestamp.fromMillis(0)
    };
    db.collection("notes").add(newNote);
    // lehetőség van a beszúrt elem ID-jét lekérdezni
    /* .then(function(docRef) {
        newNote.id = docRef.id;
      }) */
  }

  /**
   * Kitörli az elemet a FireStoreból, mint a hozzáadásnál, itt sincs Mutáció{}
   * @param item törlendő elem id-je
   */
  @Action
  public deleteNote(id: string) {
    db.collection("notes")
      .doc(id)
      .delete();
  }

  @Action
  public editNote(id: string) {
    db.collection("notes")
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()!;
          if (data.editing !== true) {
            db.collection("notes")
              .doc(id)
              .set(
                {
                  editing: true,
                  editor: firebase.auth().currentUser!.email!,
                  edited: firestore.Timestamp.now()
                },
                { merge: true }
              );
          }
        }
      });
  }

  @Action
  public editNoteSave(dataFields: { [i: string]: string }) {
    const idField = dataFields.id;
    const textField = dataFields.text;
    db.collection("notes")
      .doc(idField)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()!;
          if (
            data.editing === true &&
            data.editor === firebase.auth().currentUser!.email!
          ) {
            db.collection("notes")
              .doc(idField)
              .set(
                {
                  editing: false,
                  text: textField,
                  edited: firestore.Timestamp.now()
                },
                { merge: true }
              );
          } else { alert("Nem lehet menteni a változtatásokat!"); }
        } else { alert("Nem lehet menteni a változtatásokat!"); }
      });
  }

  @Mutation
  public removeAlertMutation(id: number) {
    this.Alerts.splice(id, 1);
  }

  @Action({ commit: "removeAlertMutation" })
  public removeAlert(id: number) {
    return id;
  }
}
