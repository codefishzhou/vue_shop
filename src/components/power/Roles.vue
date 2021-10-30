<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true"
        >添加角色</el-button
      >
      <el-table border :data="rolesList" style="width: 100%" stripe>
        <!-- 展开列 -->
        <el-table-column width="80" type="expand" label="展开">
          <template slot-scope="scope">
            <el-row
              class="vcenter"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}<i class="el-icon-caret-right"></i
                ></el-tag>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  class="vcenter"
                  :class="['bdbottom', i2 === 0 ? 'bdtop' : '']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6"
                    ><el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName
                      }}<i class="el-icon-caret-right"></i></el-tag
                  ></el-col>
                  <el-col
                    :span="18"
                    :class="['bdbottom', i3 === 0 ? 'bdtop' : '']"
                  >
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
            <!-- //保持结构 -->
            <pre>
            {{ scope.row }}
          </pre
            >
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" width="80px"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300px">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300px">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-share"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色信息"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="ruleFormrules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="ruleFormrules"
        ref="editRuleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色ID" prop="roleName">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //展示分配权限对话框 -->
    <el-dialog
      title="分配角色权限"
      :visible.sync="showDialogVisible"
      width="50%"
      @close='setRightDialogClosed'>
      <el-tree :data="rightsList" :props="treeProps" show-checkbox
  node-key="id" default-expand-all :default-checked-keys="defKeys" ref='treeRef'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //所有的权限列表
  data() {
    return {
      rolesList: [],
      addForm: {
        roleName: '',
        roleDesc: '',
        roleId: '',
      },
      // item1:'',
      // i1:'',
      editForm: {},
      //控制添加角色对话框
      dialogVisible: false,
      //控制修改角色对话框
      editDialogVisible: false,
      //分配权限对话框
      showDialogVisible:false,
      rightsList:[],
      //树形控件的属性绑定对象
      treeProps:{
        label:"authName",
        children:"children"
      },
      //挡墙即将分配权限的id
      roleId:'',
      //默认选中的节点值数组
      defKeys:[],
      //验证添加角色规则
      ruleFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '角色名称长度在3~6字符直接',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取权限列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles/')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      //   console.log(this.rolesList)
    },
    //添加角色关闭对话框，预验证
    addDialogClosed() {
      this.$refs.ruleFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editRuleFormRef.resetFields()
    },
    //修改角色之前的处理
    editRole() {
      this.$refs.editRuleFormRef.validate(async (valid) => {
        if (!valid) return
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.id,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        // this.dialogVisible = false
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败！')
        }
        this.$message.success('修改用户信息成功！')
        this.editDialogVisible = false
        this.getRoleList()
      })
    },
    //根据id查询角色
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色失败')
      this.editForm = res.data
      //   console.log(this.editForm)
      this.editDialogVisible = true
    },
    //添加角色
    addRole() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        // this.dialogVisible = false
        if (res.meta.status !== 201) {
          this.$message.error('添加角色信息失败！')
        }
        this.$message.success('添加角色信息成功！')
        this.dialogVisible = false
        this.getRoleList()
      })
    },
    //根据Id删除用户数据
    async removeUserById(id) {
      //询问是否删除数据
      //取消返回错误
      //确认返回confirm
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
        //捕获报错
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        //删除失败
        //不允许删除admin
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户数据成功')
      this.getRoleList()
    },
    // 根据id删除权限
    async removeRightById(scope, rightId) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${scope.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      //  刷新数据
      //this.getRoleList() 会刷新页面不好
      scope.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      //before 获取所以权限数据
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200)
      {return this.$message.error('获取角色权限列表失败')}
      //把获取的数据保存在data中
      this.rightsList = res.data
      // console.log(this.rightsList)
      //递归获取三级权限的id到defKeys数组中
      this.getLeafKeys(role,this.defKeys)
      this.roleId = role.id
      this.showDialogVisible = true
    },
    //通过递归，获取角色下所
    //以的三级权限的id，并保存defKeys数组中
    getLeafKeys(node,arr){
      //不包含children则为三级
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>{ 
        this.getLeafKeys(item,arr)
      })
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    async allRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
     const idStr = keys.join(',')
     const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
     if(res.meta.status !==200)
    { return this.$message.error('获取权限id失败')}
    this.getRoleList()
    this.showDialogVisible = false
    }
  },
}
</script>

<style lang='less' scoped>
.roles {
  .el-card {
    margin-top: 10px;
  }
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-top: 1px solid #eee;
  }
  //设置展开栏居中
  .vcenter {
    display: flex;
    align-items: center;
  }
}
</style>