import Vue from "vue";
import uView from "@/uni_modules/uview-ui";
import { openWebView } from "@src/utils/open-web-view";
import storage from "@utils/storage";
import logger from "@utils/logger";

import store from "./store";
import App from "./App";

Vue.use(uView);
Vue.config.productionTip = false;
Vue.prototype.openWebView = openWebView;
Vue.prototype.storage = storage;
Vue.prototype.logger = logger;

App.mpType = "app";

const app = new Vue({
  ...App,
  store,
});
app.$mount();
