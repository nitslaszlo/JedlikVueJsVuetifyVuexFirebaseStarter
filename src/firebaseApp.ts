import firebase from "firebase/app";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCEaZGpRzwptj11kiKzzL_H7J9nq2O51us",
  authDomain: "my-vuejs-typescript.firebaseapp.com",
  databaseURL: "https://my-vuejs-typescript.firebaseio.com",
  projectId: "my-vuejs-typescript",
  storageBucket: "my-vuejs-typescript.appspot.com",
  messagingSenderId: "863094360929"
};

const app = firebase.initializeApp(config);
const db = app.firestore();
db.settings({ timestampsInSnapshots: true });
export default db;
