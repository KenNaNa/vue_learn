// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment'
import Vuex from 'vuex'
import axios from 'axios'
import io from 'socket.io-client';
console.log('io',io('http://localhost:8080'))
Vue.prototype.$socket = io('http://localhost:8080');
Vue.use(Vuex,axios);
Vue.prototype.moment = moment;
Vue.prototype.random = n => Math.floor(n * Math.random());

const store = new Vuex.Store({
	state:{
		isShowAbout: false,
		name: '',
		addr: '未知',
		avatarUrl: `http://omratag7g.bkt.clouddn.com/icon-avatar${Vue.prototype.random(21)}.svg`,
		
	},
	mutations:{
		showAbout(state,flag){
			state.isShowAbout = flag;
		},
		changeName(state,name){
			state.name = name;
		},
		setAddr(state,addr){
			state.addr = addr;
		}
	}
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
