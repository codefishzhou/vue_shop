<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->

    <!-- 卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" stripe border style="width: 100%">
        <!-- 添加索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>role_name
        <el-table-column label="身份" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- scope.row可以获取当前表单全部数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- //操作 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click='showEditDialog(scope.row.id)'
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="添加用户信息" 
    :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        :model="addForm"
        :rules="ruleFormrules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入11位数手机号"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- //修改对话框 -->
    <el-dialog
  title="修改用户信息"
  :visible.sync="editdialogVisible"
  width="50%"
  @close='editDialogClose'
  >
   <el-form :model="editForm" :rules="edlitFormrules" ref="edlitFormRef" label-width="100px">
  <el-form-item label="用户名">
  <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop='email'>
  <el-input v-model="editForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop='mobile'>
  <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    //验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (regEmail.test(value)) {
        //合法的校验
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //合法的校验
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    //添加验证规则
    // 获取用户列表的参数对象
    return {
      
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框
      dialogVisible: false,
      //控制修改用户对话框
      editdialogVisible:false,
      //添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editForm:{},

      ruleFormrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 8,
            message: '用户名长度在3~10字符直接',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '密码长度在6~10字符直接',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      edlitFormrules:{
         email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
    }
  },

  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      console.log(res.data.users)
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 重置添加用户信息对话框
    addDialogClosed(){
      this.$refs.ruleFormRef.resetFields()
    },
    //重置修改用户信息对话框
    editDialogClose(){
      this.$refs.edlitFormRef.resetFields()
    },
    addUser(){
  
      this.$refs.ruleFormRef.validate(async valid =>{
        if(!valid) return
        //可以发起添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addForm)
        // this.dialogVisible = false
        if(res.meta.status !==201){
        this.$message.error('添加用户信息失败！')
        }
        this.$message.success('添加用户信息成功！')
        this.dialogVisible = false;
        this.getUserList()
      })
    },
    //修改表单之前的预先验证
    editUser(){
      this.$refs.edlitFormRef.validate(async valid =>{
        if(!valid) return
        //可以发起添加用户的网络请求
        const {data:res} = await this.$http.put('users/'+this.editForm.id,{
          
          mobile:this.editForm.mobile,
          email:this.editForm.email
        })
        // this.dialogVisible = false
        if(res.meta.status !==200){
        this.$message.error('修改用户信息失败！')
        }
        this.$message.success('修改用户信息成功！')
        this.editdialogVisible = false;
        this.getUserList()
      })
    },
    //根据Id删除用户数据
    async removeUserById(id){
      //询问是否删除数据
        //取消返回错误
        //确认返回confirm
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        //捕获报错
        ).catch(err =>err)
        if(confirmResult !== 'confirm')
       { return this.$message.info('取消删除')}

       const {data: res} = await this.$http.delete('users/'+id)
       if(res.meta.status !== 200)
       //删除失败
       {
         //不允许删除admin
         return this.$message.error('删除用户失败！')
       }
       this.$message.success('删除用户数据成功')
       this.getUserList()
    },
    // 修改数据
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !==200) return this.$message.error('查询用户失败')
      this.editForm = res.data
      this.editdialogVisible = true
    },
    //监听switch开关状态
    //拼接数据使用模板字符串
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )

      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
  },
}
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
  box-shadow: 0 2px 2px 0 rgb(90, 102, 90) !important;
  border-radius: 30px;
}
.el-breadcrumb {
  font-size: 24px;
}
</style>