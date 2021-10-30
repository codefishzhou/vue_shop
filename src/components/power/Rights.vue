<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table border stripe=true :data="rightsList" style="width: 100%">
      <el-table-column type="index" width="80"> </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200px">
      </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column prop="level" label="级别">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
        <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
        <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    //所有的权限列表
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    //获取权限列表
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    },
  },
}
</script>

<style lang='less' scoped>
</style>