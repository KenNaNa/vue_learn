<template lang="html">
	<transition name='slide-top'>
		<div class="login">
			<i @click='showAbout' class="icon-about" title="关于"></i>
			<a target="_blank" href="https://github.com/KenNaNa" class='icon-website' title='github'></a>
			<i class="icon-chat" title="聊天"></i>
			<h2>请输入您的名字</h2>
			<input type="text" autofocus @keyup.enter='login' v-model.trim="name">

			<transition name='showAbout'>
				<About v-if='isShowAbout'></About>
			</transition>
		</div>
	</transition>
	
</template>

<script type="text/javascript">
import About from '../About/About'
	export default {
		name: 'Login',
		components:{
			About,
		},
		data(){
			return {
				name: ''
			}
		},
		computed: {
			isShowAbout(){
				return this.$store.state.isShowAbout;
			}
		},

		methods: {
			showAbout(){
				this.$store.commit('showAbout',true);
			},
			login(){
				if(!this.name){
					// 如果名字为空，则什么都不做
					return;
				}

				// 向mutations提交名字
				this.$store.commit('changeName',this.name);

				// 将名字写入本地缓存中
				localStorage.name = this.name;

				// 跳转到Chatting页面
				// 改变路由地址
				this.$router.push('Chatting')
			}
		}
	}
</script>


<style lang="scss" scoped>
.login{
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;/*设置为伸缩模型盒子*/
	flex-direction: column; /*主轴方向为纵向*/
	align-items: center; /*设置主轴纵向居中*/
	justify-content: center; /*设置内容横向向居中*/
	background-color: black;
	height: 100%;
	width: 100%;
	color: white;

	i.icon-about{
		position: absolute;
		top: 20px;
		right: 80px;
		height: 40px;
		width: 40px;
		background:url('../../common/icons/icon-about.svg') no-repeat;
		background-size: contain;
	}

	a.icon-website{
		position: absolute;
		top: 20px;
		right: 20px;
		width: 40px;
		height: 40px;
		background: url('../../common/icons/icon-website.svg') no-repeat;
		background-size: contain;
		/*margin-bottom: 30px;*/
	}

	i.icon-chat{
		width: 60px;
		height: 60px;
		background: url('../../common/icons/icon-chat.svg') no-repeat;
		background-size: contain;
	}

	h2{
		letter-spacing: 1px;
	}


	input{
		width: 300px;
		padding: 5px 10px;
		margin-top: 10px;
		background-color: #000000;
		color: #ffffff;
      	border-bottom: 1px solid #ffffff;
      	text-align: center;
      	font-size: 2rem;
      	letter-spacing: 2px;
	}
}
</style>