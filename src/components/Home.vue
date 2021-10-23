<template>
  <div id='home'>
      <el-button type='info' @click="logout" class='logout'>退出</el-button>
  </div>
</template>

<script>
export default {
name:'home',
methods:{
    logout(){
    window.sessionStorage.clear();
    this.$router.push('/login')
    }
}
}

</script>

<style lang='less' scoped>
#home{
    height:100%;
    background-image:url('../assets/img/1.jpg');
    background-size: 100%;
}
.logout{
    position: absolute;
    margin-left:95%;
}
</style>