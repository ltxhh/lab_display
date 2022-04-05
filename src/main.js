// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;
Vue.use(ElementUI);
/*引入axios*/
import Axios from "axios";
Vue.prototype.axios = Axios;

import "xterm/dist/xterm.css";
import { Terminal } from "xterm";

// 布局组件 可以不用
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);
//Axios.defaults.withCredentials = true;

require("!style-loader!css-loader!../static/index.css");

import QS from "qs";
Vue.prototype.qs = QS;

import HeyUI from "heyui";
Vue.use(HeyUI);

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  render: h => h(App)
});
