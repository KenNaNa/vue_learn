<template lang="html">
	<transition>
		<div class="chatting">
			<!-- 聊天界面的头部 -->
			<div class="chatting-header">
				<div class="chatting-back">
				<i @click='back' :class="[isRedAI?'icon-back':'icon-back2']"></i>
				</div>
				<div class="chatting-title">
					<h2><i class="icon-group"></i>群聊</h2>
				</div>
				<div class="chatting-menu">
					<i @click='toMenu' class="icon-menu"></i>
				</div>
			</div>

			<!-- 聊天内容区域 -->
			<div @click.stop.prevent="isShowEmoji=false" class="chatting-content" ref='chattingContent'>
				<div v-for="item of msgs">
					<!-- v-if -->
					<div v-if="item.self" class="chatting-item self clearfix">
						<div class="msg-date">
							{{ item.date }}
						</div>
						<div class="msg-from">
							<span class="loc">[{{item.loc}}]</span>
              				<span class="msg-author">{{ item.from}}</span>
              				<img :src="item.avatarUrl" alt="">
						</div>
						<div class="msg-content">{{ item.content }}</div>
					</div>

					<!-- v-else -->
					<div v-else class="chatting-item other clearfix">
			            <div class="msg-date">
			            	{{ item.date }}
			            </div>
			            <div class="msg-from">
			              <img :src="item.avatarUrl" alt="">
			              <span class="loc">[{{item.loc}}]</span>
			              <span class="msg-author">{{ item.from}}</span>
			            </div>
			            <div class="msg-content">{{ item.content }}</div>
			        </div>
				</div>
			</div>

			<!-- 输入区域 -->
			<div class="chatting-input">
				<transition name="slide-bottom">
					<div v-show="isShowEmoji" class="emoji-display">
						<ul>
							<li @click='insertText(item)' v-for="item in emojis">{{item}}</li>
						</ul>
					</div>
				</transition>

				<div class="emoji">
					<i @click="showEmoji(isShowEmoji=!isShowEmoji)" class="icon-emoji"></i>
				</div>

				<textarea @keyup.enter="send" @input="newLine" ref="textarea" v-model.trim="inputContent" placeholder="左上角还有智能机器人哦"></textarea>
        		<button @click="send">发送</button>
			</div>
		</div>
	</transition>
</template>

<script type="text/javascript">
	export default {
		name: 'Chatting',
		data(){
			return {
				isRedAI: false,
				isShowEmoji: false,
				emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '☀', '😜', '😎', '😊', '😳', '☪', '😱', '😒', '😔', '😷', '👿', '♥', '😩', '😤', '😣', '😰', '', '', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳','⑥⑥⑥','↑','↓','←','→'],
				inputContent: '',
				// 获取缓存数据
				// 没有则返回[]
				msgs: localStorage.msgs_group && JSON.parse(localStorage.msgs_group) || [],
				oContent: {},
      			oTextarea: {},
			}
		},
		watch: {
		    msgs(val) {
		    	// 检测输入框是否输入且发送消息
		    	// 就会更新本地缓存的msgs_group数组
		      localStorage.msgs_group = JSON.stringify(val);
		    }
		},
		computed: {
		    name() {
		      // 计算方法name()从state仓库中获取name
		      return this.$store.state.name;
		    },
		    avatarUrl() {
		      // 计算属性avatarUrl()从state仓库中获取avatarUrl属性
		      return this.$store.state.avatarUrl;
		    }
		},
		beforeRouteEnter(to, from, next) {
			// 在进行路由跳转之前判断本地缓存的名字是否存在
			// 不存在去登陆
		    if (!localStorage.name) {
		      next('/')
		    } else {
		      // 否则就跳转到对应页面
		      next();
		    }
		},
		mounted(){
			setInterval(()=>{
				// 切换机器人头像的样式
				this.isRedAI = !this.isRedAI;
			},2500);
			// 把DOM元素 给存起来，供后面使用
			console.log(this)
			this.oContent = this.$refs.chattingContent;
			this.oTextarea = this.$refs.textarea;
			this.oContent.scrollTop = this.oContent.scrollHeight;

			// 监听某人上线了
			// 分派一个函数
			// 指定参数 this.$store.state.name
			this.$socket.emit('online', this.$store.state.name);

		    this.$socket.on('online', (name) => {
		    	// 回取数据
		    	console.log(1)
		      if (!name) {
		        return;
		      }
		      // 创建某人上线提示
		      let oOnline = document.createElement('div');
		      oOnline.className = 'online';
		      oOnline.innerText = name + '上线了';
		      this.oContent.appendChild(oOnline);
		      this.oContent.scrollTop = this.oContent.scrollHeight;


		    });

		    // 接收群聊消息
		    this.$socket.on('receiveGroupMsg', data => {
		      this.msgs.push(data);
		      setTimeout(() => {
		        this.oContent.scrollTop = this.oContent.scrollHeight;
		      }, 0);
		    });

		    this.oContent.scrollTop = this.oContent.scrollHeight;
		},
		methods: {
			back(){
				this.$router.push('/AI');
			},
			toMenu(){
				this.$router.push('/');
			},
			showEmoji(flag){
				// 切换状态
				this.isShowEmoji = flag;

				// 如果用户不点击了，自动消失
				setTimeout(()=>{
					this.isShowEmoji = false;
				},5000);
			},
			send(){

				// 当我们在发送时，隐藏小图标库
				this.isShowEmoji = false;
				if(this.inputContent===''){
					//如果输入框内容为空
					//则什么都不做
					return ;
				}else{
					// 否则派发群聊消息到后台
					// 包含发送日期 date
					// 地址        loc
					// 名称        from
					// 头像        avatarUrl
					// 内容        inputContent
					this.$socket.emit('sendGroupMsg',{
						date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
                        loc: localStorage.addr,
          				from: `${localStorage.name}`,
          		        content: this.inputContent,
          				avatarUrl: this.avatarUrl
					});
					// 添加消息队列
					this.msgs.push({
						date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
                        loc: localStorage.addr,
          				from: `${localStorage.name}`,
          		        content: this.inputContent,
          				avatarUrl: this.avatarUrl
					});

					// 消息发送之后，将输入框的内容清空
					this.inputContent = '';
					// 将内容放在最底下
					setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 0);
				}


			},
			insertText(str){
				// 插入文本
				str = str + ``;
				const oTextarea = this.$refs.textarea;
				if(document.selection){
	           	 	oTextarea.focus();
	            	let sel = document.selection.createRange();
	            	// 设置或获取范围内包含的文本
	            	sel.text = str;
				}else if(typeof oTextarea.selectionStart === 'number' && typeof oTextarea.selectionEnd === 'number'){
					// 获取选区的其实位置
		            var startPos = oTextarea.selectionStart,
		            // 获取选区的结束位置
		                endPos = oTextarea.selectionEnd,
		                // 设置光标位置
		                cursorPos = startPos,
		                // 传入obj的内容
		                tmpStr = oTextarea.value;
		            // 插入内容
		            this.inputContent = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
		            // 光标现在位置
		            cursorPos += str.length;

		            // 重新设置选中区域
            		oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;
				}else{
					oTextarea.value += str;
				}

				this.newLine();
			},
			newLine(){
				setTimeout(() => this.oTextarea.scrollTop = this.oTextarea.scrollHeight, 0);
			}
		}
	}

</script>

<style lang="scss" scoped>
$blue: #2196f3;
.chatting{
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;

	.chatting-content{
		flex: 1;
      	width: 100%;
      	background-color: rgba(0, 0, 0, .1);
      	overflow: auto;

      	.chatting-item{
      		padding: 10px;
        	width: 100%;
			
			.msg-date{
				text-align: center;
          		color: gray;
          		font-size: 80%;
			}

			.msg-from{
				display: flex;
          		align-items: center;

          		.loc{
          			color: gray;
            		font-size: 60%;
            		margin-right: 5px;
          		}
          		.msg-author{
          			font-size: 1.2rem;
          		}

          		img {
		            width: 30px;
		            height: 30px;
		            border-radius: 15px;
		        }
			}
			.msg-content{
				margin-top: 5px;
          		background-color: white;
          		width: 200px;
          		padding: 6px 10px;
          		border-radius: 10px;
			}
      	}
      	.chatting-item + .chatting-item {
	        margin-top: 10px;
	    }
		.self {
	        .msg-from {
	          display: flex;
	          justify-content: flex-end;
	          align-items: center;
	          img {
	            margin-left: 10px;
	          }
	        }

	        .msg-content {
	          float: right;
	          word-wrap: break-word;
	          word-break: break-all;
	          margin-right: 10px;
	        }
      	}

      	.other {
	        .msg-from {
	          display: flex;
	          justify-content: flex-start;
	          align-items: center;
	          span.loc {
	            color: gray;
	            font-size: 60%;
	            margin-right: 5px;
	          }
	          img {
	            margin-right: 10px;
	          }
	        }

	        .msg-content {
	          float: left;
	          margin-left: 10px;
	          word-wrap: break-word;
	          word-break: break-all;
	        }

	    }
	    .online {
	        width: 200px;
	        // max-width: 100%;
	        margin: 3px auto;
	        border-radius: 4px;
	        text-align: center;
	        background-color: #FFFDE7;
	    }
	}

	.chatting-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;
		width: 100%;
		background-color: $blue;
		color: white;
      	padding-left: 10px;
      	padding-right: 15px;


      	.chatting-back{
      		width: 32px;
      		height: 32px;

      		.icon-back{
      			background: url('../../common/icons/icon-ai.svg') no-repeat;
          		background-size: contain;
      		}

      		.icon-back2 {
	          background: url('../../common/icons/icon-ai2.svg') no-repeat;
	          background-size: contain;
	        }
      	}

      	.chatting-title{
      		h2{
      			color: blue;
      			cursor: pointer;
      		}
      		.icon-group{
      			vertical-align: top;
      			width: 30px;
          		height: 30px;
          		background: blue url('../../common/icons/icon-group.svg') no-repeat;
          		background-size: contain;
          		margin-right: 3px;
      		}
      	}

      	.chatting-menu{
      		width: 30px;
        	height: 30px;
	        i.icon-menu {
	          background: url('../../common/icons/icon-index.svg') no-repeat;
	          background-size: contain;
	        }
      	}
	}


	.chatting-input{
		position: relative;
      	display: flex;
      	height: 40px;
      	width: 100%;

      	.emoji-display{
      		position: absolute;
        	width: 100%;
        	height: 210px;
        	background-color: white;
        	top: -210px;
        	left: 0;
        	overflow-y: auto;

        	ul {
	          	display: flex;
	          	flex-wrap: wrap;

	          li {
	            	padding: 2px 3px;
	            	font-size: 2.2rem;
	          }
	        }
      	}

      	.emoji {
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        width: 45px;
	        height: 100%;
	        background-color: rgba(0, 0, 0, .1);
	        .icon-emoji {
	          	width: 40px;
	          	height: 100%;
	          	background: url('../../common/icons/icon-emoji.svg') no-repeat;
	          	background-size: contain;

	        }
	    }


	    textarea{
	    	flex: 1;
        	resize: none;
        	padding-left: 3px;
        	padding-top: 7px;
        	padding-right: 3px;
        	height: 100%;
        	font-size: 1.4rem;
	    }

	    button{
	    	width: 60px;
        	height: 100%;
        	background-color: $blue;
        	color: white;
        	font-size: 16px;
	    }
	}

}	
</style>