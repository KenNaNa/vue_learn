import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login/Login'
import Chatting from '@/components/Chatting/Chatting'
import AI from '@/components/Chatting/AI'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
    	path: '/',
    	name: 'Login',
    	component: Login
    },
    {
    	path: '/Chatting',
    	name: 'Chatting',
    	component: Chatting
    },
    {
        path: '/AI',
        name: 'AI',
        component: AI
    }
  ]
})
