<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Chatting from './components/Chatting/Chatting.vue';
import Login from './components/Login/Login.vue';
import axios from 'axios';
export default {
  name: 'App',
  components: {
    Chatting,
    Login,
  },
  beforeCreate() {
    console.log("%c Powered by Zhaohui - microzz.com","background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;");
  },
  created() {
    localStorage.addr = '未知';

    axios.get('https://zhaoplus.com/api/ip')
      .then(result => {
      	console.log(result);
        if (result.data.content.address) {
          localStorage.addr = result.data.content.address;
        }
      })
  }
}
</script>

<style lang='scss'>
@import "./common/style/base.scss";
*{
	margin: 0;
	padding: 0;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
