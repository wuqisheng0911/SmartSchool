<!-- 年级管理页面 -->
<template>
    <div class="gradeManage">
  	    <div class="header">
  	  		<el-input placeholder="请输入搜索关键字" v-model="search" clearable style="width:200px"></el-input>
	  	    <div class="header-opera">
	  	    	<el-button type="success" @click="add">添加</el-button>
	  	   		<el-button type="danger" @click="batchDalete">批量删除</el-button>
	  	    </div>
  	    </div>
		<el-table :data="gradeList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column prop="name" label="名称" width="280"></el-table-column>
            <el-table-column prop="descriptioin" label="简介"></el-table-column>
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
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="简介" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.descriptioin"></el-input>
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
    	...mapGetters(['grades']),
    	gradeList(){
    		let vm = this;
    		return vm.grades.filter(item=>{
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
    	...mapActions(['getAllGrade','saveOrUpdateGrade','lineDeleteGrade','batchDelethGrade']),
    	loadData(){
    		this.getAllGrade().then(data=>{})
    	},
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
	    handleEdit(scope,row){
	    	this.title = "修改年级信息";
	    	this.dialogFormVisible = true;
	    	this.form = {
	    		name:row.name,
	    		id:row.id,
	    		descriptioin:row.descriptioin,
	    		schoolId:3
	    	}
	    },
	    handleDelete(scope,row){
	    	let vm = this;
	    	this.lineDeleteGrade({id:row.id}).then(data=>{
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
	    	this.title = "新增年级信息";
	    	this.dialogFormVisible = true;
	    	this.form = {
	    		schoolId:3
	    	};
	    },
	    batchDalete(){
	    	let vm = this;
	    	let arr = [];
	    	this.multipleSelection.forEach(item=>{
	    		arr.push(item.id)
	    	});
	    	this.batchDelethGrade({ids:arr.join(",")}).then(data=>{
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
	    	this.saveOrUpdateGrade(vm.form).then(data=>{
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
  	.gradeManage {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}
  	}
</style>