<template>
  <el-container id="home">
    <!-- 头部区域 -->
    <el-header height="80px">
      <div>
        <img src="../assets/a.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container class="asider_Main">
      <!-- 导航区域 -->
      <el-aside :width="iscollapse?'200px':'64px'">
          <div class='toggle_button' @click="toggleCollapse"><i class="iconfont icon-showpassword"></i></div>
        <el-col :span="15">
          <el-menu
            background-color="#286F75"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse=!iscollapse
            :collapse-transition="false"
            :router="true"
            :default-active='activePath'
            >
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <!-- template 一级菜单的模板区域 -->
             <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconObj[item.id]"></i>
                    <!-- 导航文字 -->
                    <span>{{item.authName}}</span>
                  </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+childrens.path"  
              v-for = "childrens in item.children" 
              :key="childrens.id" 
              @click="savaNavState('/'+childrens.path)">
                <template slot="title">
                     <!-- 图标 -->
                    <i class="el-icon-s-grid"></i>
                    {{childrens.authName}}
                    </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  //创建生命周期函数
  created() {
    //获取所以的菜单
    this.getMunuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data(){
     return{
          menulist:[],
          iconObj:{
              '125':'iconfont icon-user',
              '103':'iconfont icon-tijikongjian', 
              '101':'iconfont icon-shangpin',
              '102':'iconfont icon-danju',
              '145':'iconfont icon-baobiao'
          },
          iscollapse:'flase',
          activePath:''
     }
  },

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMunuList() {
    //await 简化promise
       const { data: res} = await this.$http.get('menus')
       if(res.meta.status !==200) return this.$message.error(res.meta.msg)
       this.menulist = res.data;
      //  console.log(res)
    },
    //点击按钮切换导航面板折叠
    toggleCollapse(){
        this.iscollapse = !this.iscollapse
    },
    //切换当前页面为active--保存链接的激活状态
    savaNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  },
}
</script>

<style lang='less' scoped>
#home {
  height: 100%;
  background-color: rgb(240, 231, 220);
}

.el-header {
  background-color: #347176;
  // height:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 30px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
  img {
    height: 72px;
    border-radius: 40px;
  }
}
.el-aside {
  background-color: #347176;
  .el-col {
    width: 100%;
  }
  .el-menu{
    border-right: none;
}
.iconfont{
    margin-right:5px;
}
.toggle_button{
    background-color:#2E7553;
    
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    //间距
    letter-spacing: 0.2em;
    //鼠标放上去变小手
    cursor: pointer;
    
}
}
.el-main {
  background-image: url('../assets/img/3.jpg');
  filter:alpha(opacity=70);-moz-opacity:0.9;opacity:0.70;
  background-size:100%;
}


</style>