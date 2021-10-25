<template>
  <div id='login_container'>
<div class="login_box">
<div class="avatar_box">
  <img src="../assets/a.png" alt="">
</div>
<!-- 登录表单区域 -->
<!-- 用户名 -->
  <!-- ref获取实列对象 -->
  <el-form  :model='form' :rules="rules" ref='loginFormRef' class="formm">
   <el-form-item prop="username">
    <el-input prefix-icon="el-icon-s-custom" v-model='form.username'></el-input>
  </el-form-item>
<!-- 密码 -->
   <el-form-item prop="password">
    <el-input type="password" prefix-icon="el-icon-key" v-model='form.password'></el-input>
  </el-form-item>
  <!-- 按钮 -->
<el-form-item  class='btns'>
 <el-button type="success" @click="login">登录</el-button>
  <el-button type="info" @click="resetLoginForm">重置</el-button>
</el-form-item>
</el-form>
</div>
</div>
</template>

<script>
export default {
  name:'Login',
  data(){
    return{
      // 这是登录表单的数据
      form:{
        username:'admin',
        password:'123456',
      },
       rules:{
        //  验证用户名
          name:[
            { required: true, message: '请输入用户名', trigger: 'onblur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'onblur' }
          ],
        //  验证密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
        }
    }
  },
      methods:{
        //点击重置按钮,重置登录
        resetLoginForm(){
          this.$refs.loginFormRef.resetFields()
        },
        login(){
          this.$refs.loginFormRef.validate(async valid =>{
            if(!valid) return;
            const { data: res } = await this.$http.post('login',this.form);
          // data为服务器返回的真实数据,将其解构为真实数据res
            if(res.meta.status !== 200) return this.$message.error('登录失败')
            this.$message.success('登录成功')
            // console.log(res);
            window.sessionStorage.setItem('token',res.data.token);
            // 跳转到home
            this.$router.push('./home')
          });
        }
      },
};
</script>

<style lang='less' scoped>
#login_container{
  background-image:url('../assets/img/2.jpg');
  background-size: 100%;
  height:100%;
}
.login_box{
  width:500px;
  height:300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  width:150px;
  height:150px;
  border:10px solid #ffe;
  border-radius: 50%;
  padding:10px;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width:100%;
    height:100%;
    border-radius: 50%;
    background-color: #dbecdb;
  }
}
.btns{
  display: flex;
  justify-content: flex-end;
  margin:20px 0;
  box-sizing: border-box;
  // el-button{
  //   disabled:false;
  // }
}
.formm{
  position:absolute;
  top:40%;
  width:90%;
  margin:0 5%;
}
</style >
