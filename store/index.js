import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app.js";
import user from "./modules/user.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
  },
});

export default store;
