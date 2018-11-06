<!-- 课程管理页面 -->
<template>
    <div class="courseManage">
    	<div class="header">
  	  		<el-input placeholder="请输入搜索关键字" v-model="search" clearable style="width:200px"></el-input>
	  	    <div class="header-opera">
	  	    	<el-button type="success" @click="add">添加</el-button>
	  	   		<el-button type="danger" @click="batchDalete">批量删除</el-button>
	  	    </div>
  	    </div>
		<el-table :data="courseList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column prop="name" label="课程名称" width="280"></el-table-column>
            <el-table-column prop="period" label="课程周期(周)" width="180"></el-table-column>
            <el-table-column prop="description" label="课程简介"></el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button plain type="success" @click="handleEdit(scope.$index, scope.row)">
                      	<i class="el-icon-edit-outline"></i>
                    </el-button>
                    <el-button plain type="danger" @click="handleDelete(scope.$index, scope.row)">
                      	<i class="el-icon-delete"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 模态框 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="400px">
            <el-form :model="form">
                <el-form-item label="课程名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程周期" :label-width="formLabelWidth">
                    <el-input v-model="form.period" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程简介" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    data(){
	    return {
	     	search:'',
	     	form:{},
	     	title:"",
	     	multipleSelection:[],
	     	formLabelWidth:"80px",
	     	dialogFormVisible:false,
	    }
    },
    computed:{
    	...mapGetters(['courses']),
    	courseList(){
    		let vm = this;
    		return vm.courses.filter(item=>{
    			if(item.name != null){
    				 return item.name.indexOf(vm.search) != -1;
    			}
    		})
    	},
    },
    created(){
    	this.loadData();
    },
    methods:{
    	...mapActions(['getAllCourse','saveOrUpdateCourse','lineDeleteCourse','batchDelethCourse']),
    	loadData(){
    		this.getAllCourse().then(data=>{})
    	},
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
	    handleEdit(scope,row){
	    	this.title = "修改课程信息";
	    	this.dialogFormVisible = true;
	    	this.form = {
	    		id:row.id,
	    		name:row.name,
	    		period:row.period,
	    		description:row.description
	    	}
	    },
	    handleDelete(scope,row){
	    	let vm = this;
	    	this.lineDeleteCourse({id:row.id}).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 删除成功',
				        type: 'success'
			        });
	    			vm.loadData();
	    		}else {
	    			vm.$message({
			            showClose: true, 
			            message: data.stauts+' 删除操作失败',
			            type: 'error'
			        });
	    		}
	    	}).catch(error=>{
	    		vm.$message({
		            showClose: true,
		            message: error,
		            type: 'error'
		        });
	    	})
	    },
	    add(){
	    	this.title = "新增课程信息";
	    	this.dialogFormVisible = true;
	    	this.form = {}
	    },
	    batchDalete(){
	    	let vm = this;
	    	let arr = [];
	    	this.multipleSelection.forEach(item=>{
	    		arr.push(item.id)
	    	});
	    	this.batchDelethCourse({ids:arr.join(",")}).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 批量删除成功',
				        type: 'success'
			        });
	    			vm.loadData();
	    		}else {
	    			vm.$message({
			            showClose: true,
			            message: data.stauts+' 批量删除操作失败',
			            type: 'error'
			        });
	    		}
	    	}).catch(error=>{
	    		vm.$message({
		            showClose: true,
		            message: error,
		            type: 'warning'
		        });
	    	})
	    },
	    save(){
	    	let vm = this;
	    	this.dialogFormVisible = false;
	    	this.saveOrUpdateCourse(vm.form).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 保存/更新成功',
				        type: 'success'
			        });
	    			vm.loadData();
	    		}else {
	    			vm.$message({
			            showClose: true,
			            message: data.stauts+' 保存/更新操作失败',
			            type: 'error'
			        });
	    		}
	    	}).catch(error=>{
	    		vm.$message({
		            showClose: true,
		            message: error,
		            type: 'warning'
		        });
	    	})
	    }
    }
}
</script>
<style scoped lang="scss">
  	.courseManage {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}
  	}
</style>