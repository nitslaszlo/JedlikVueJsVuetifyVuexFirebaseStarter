import Vue from "vue";
import Vuex from "vuex";
import MyModule from "@/store/MyModule";
import Note from "@/store/Note";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    myMod: MyModule,
    note: Note
  }
});
