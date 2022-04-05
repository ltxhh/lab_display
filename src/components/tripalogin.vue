<template>
    <div>
        <lab_head />
        <lab_header />
        <div class="vip-header layout-no-margin-top" style="min-height:215px;">
            <h1 class="vip-header-title">三方登陆需要进行手机绑定</h1>
            <h4 class="vip-header-description">欢迎加入实验楼，拥有自己的实验机</h4>
        </div>
        <br><br>
        <div>
          <center>
            <table style="border:1px solid #fff" cellpadding='50px'>
              <tr>
                  <td><div class='board_ele'>手机号：</div></td>
                  <td><div class='board_ele'><input type="text" v-model="phone"></div></td>
                </tr>
                <br><br>
                <tr>
                  <td><div class='board_ele'>验证码：</div></td>
                  <td><div><input type="text" v-model="sms_code"></div></td>
                </tr>
                <br><br>
          </table>
            <div><Button color='blue' @click="sendcode">获取验证码</Button>&nbsp;<Button color='red' @click="verif">验证</Button></div>
          </center>
        </div>
        <div class="container">
        <div class="vip-faq-header">
          <img src="/static/img/vip-faq.png">
          FAQ
          <span></span>
        </div>
        <div class="vip-faq-body">
          <h4>什么要加入实验楼</h4>
          <div>1. 拥有在线环境。</div>
          <div>2. 环境不只是简单提供一个虚拟机，会根据每个实验的设计，把需要的文件、代码、资源、挑战测试都预置好，方便大家练习。</div>
          <div>3. 现在根据技术方向不同，环境已经可以支持图形、字符、WebIDE、Jupyter Notebook四种界面。</div>
          <div>4. 每个实验都是由攻略化的图文教程和配套的在线实验环境组成，引导用户通过不断的 Coding、实践，一步步踏踏实实成长。</div>
        </div>
        <div class="vip-faq-footer">
          <a href="/questions/1440">更多疑问，查看这里></a>
        </div>
      </div>
        <lab_footer />
    </div>
</template>

<script>
// 导入组件
import lab_head from './common/lab_head';
import lab_header from './common/lab_header';
import lab_footer from './common/lab_footer';
import {send_phone_code_post,verif_post, verif_get} from './axios_api/api';
// import {config,formatXml} from '../config.js';
export default {
    data(){
        return{
            phone:'',
            sms_code:'',
            // jwt:'',
            // type:'',
            unid:'',

        }
    },
    components: {
    lab_head,
    lab_header,
    lab_footer,
  },
     mounted(){
      this.getUnid()
        // this.type=this.$route.query['code']
        // this.jwt=this.$route.query['jwt']
    },
    methods:{
      getUnid(){
        let code = this.$route.query.code
        var data = {'code': code}
        verif_get(data).then((res)=>{
          if (res.code==200){
            localStorage.setItem("username", res.data.username);
              // localStorage.setItem('img',res.data.img)
                localStorage.setItem("token", res.data.refresh_token);
                localStorage.setItem('img',res.data.img)
                localStorage.setItem("uid", res.data.uid);
                this.login_username = res.data.username;
                this.opened = false;
                console.log(res);
                alert(res.message);
                this.$router.push("/");
          }else{
            this.unid = res.data.unid
          }
        })
      },
        verif(){
          // jwt:this.jwt,,type:this.type
            var data = { phone: this.phone, sms_code: this.sms_code, 'unid': this.unid}
            verif_post(data).then(res=>{
                if (res.code == 200){
                localStorage.setItem("username", res.data.username);
              localStorage.setItem('img',res.data.img)
                localStorage.setItem("token", res.data.refresh_token);
                localStorage.setItem("uid", res.data.uid);
                this.login_username = res.data.username;
                this.opened = false;
                console.log(res);
                alert(res.message);
                this.$router.push("/");
              }else{
                alert(res.message)
              }
            })

        },
        sendcode() {
        // 1、验证手机号是否为空
        if (!this.phone) {
          this.message = "手机号不能为空";
          this.$Message(this.message);
          return false;
        }

        // 2、正则验证手机号格式
        var reg = new RegExp(/^[1][34578][0-9]{9}$/);
        if (!reg.test(this.phone)) //检测字符串是否符合正则表达式
        {
          this.message = "手机号格式不正确";
          this.$Message(this.message)
        }

        // 3、将用户短信发送
        var data = {phone:this.phone}
        send_phone_code_post(data).then((res) => {
          if (res.code == 200) {
            console.log('短信发送成功')
            alert(res.msg)
          } else {
            alert('网络超时')
          }
        }).catch((err) => {
          console.log(err)
        })
      },

    },
}
</script>

<style>

</style>
