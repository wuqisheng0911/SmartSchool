<!-- 课调管理页面 -->
<template>
    <div class="sManage">
    	<div class="header">
  	  		<el-input placeholder="按班级名称查询" v-model="search" clearable style="width:200px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
	  	    <div class="header-opera">
	  	    	<el-button type="success" @click="add">添加</el-button>
	  	   		<el-button type="danger" @click="batchDalete">批量删除</el-button>
	  	    </div>
  	    </div>
		<el-table :data="surveyList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column prop="clazzVM.grade.name" label="年级" width="120"></el-table-column>
            <el-table-column prop="clazzVM.name" label="班级" width="80"></el-table-column>
            <el-table-column prop="course.name" label="课程" width="120"></el-table-column>
            <el-table-column prop="qnVM.name" label="问卷" width="140px"></el-table-column>
            <el-table-column prop="user.name" label="讲师" width="180"></el-table-column>
            <el-table-column prop="surveydate" label="课调时间"></el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                	<el-button style="display:none" @click="handleStart(scope.$index, scope.row)">开启</el-button>
                    <el-button size="mini" type="info" plain @click="handleView(scope.$index, scope.row)">预览</el-button>
                    <el-button size="mini" type="success" plain @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 模态框 新增，修改-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="500px">
            <el-form :model="form">
            	<el-form-item label="年级" :label-width="formLabelWidth">
                    <el-select v-model="gradeList" placeholder="--请选择年级--" @change="showClazz">
                        <el-option v-for="(item,index) in grades" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级" :label-width="formLabelWidth">
                    <el-select v-model="form.clazzId" placeholder="--请选择班级--" :disabled="flag">
                        <el-option v-for="(item,index) in clazzList" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" :label-width="formLabelWidth">
                    <el-select v-model="form.courseId" placeholder="--请选择课程--">
                        <el-option v-for="(item,index) in courses" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问卷" :label-width="formLabelWidth">
                    <el-select v-model="form.questionnaireId" placeholder="--请选择问卷--">
                        <el-option v-for="(item,index) in naires" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="讲师" :label-width="formLabelWidth">
                    <el-select v-model="form.userId" placeholder="--请选择讲师--">
                        <el-option v-for="(item,index) in teachers" :label="item.name" :value="item.id" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开启" :label-width="formLabelWidth">
                     <el-checkbox v-model="checked">创建后开启课调</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 一级模态框 预览 -->
        <el-dialog :title="view.qnVM?view.qnVM.name:''" :visible.sync="dialogViewVisible" :modal-append-to-body='false' width="1000px" style="margin-top:-50px">
           <div class="main main-to">
				<div class="list">
					<div>班级：{{view.clazzVM?view.clazzVM.name:""}}</div>
					<div>讲师：{{view.user?view.user.name:""}}</div>
					<div>时间：{{view.surveydate}}</div>
					<div>课程：{{view.course?view.course.name:""}}</div>
				</div>
                <ul>
                    <li v-for="(value,index) in viewVisible">
                        <h3 style="font-weight:bold"><span>{{index+1}}</span>：<span>{{value.name}}</span>(<span>{{value.questionType}}</span>)</h3>
                        <p v-if="value.options.length != 0" v-for="item in value.options">
                            {{item.label}}:{{item.name}}
                        </p>
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
    data(){
	    return {
	     	title:'',
	     	form:{},
	     	search:'',
            gradeList:"",
            view:{},
            viewVisible:[],
            checked:false,
            formLabelWidth:'120px',
            multipleSelection:[],
            flag:true,
            dialogFormVisible:false,
            dialogViewVisible:false,
	    }
    },
    created(){
    	this.loadData();
    	this.getAllGrade().then(data=>{});
    	this.getAllClazz().then(data=>{});
    	this.getAllCourse().then(data=>{});
    	this.getAllTeacher().then(data=>{});
    	this.getAllNaire().then(data=>{});
    },
    computed:{
    	...mapGetters(['changeMsg','grades','clazzs','courses','teachers','naires']),
    	surveyList(){
    		let vm = this;
    		return vm.changeMsg.filter(item=>{
    			if(item.clazzVM && item.clazzVM.name != null){
    				return item.clazzVM.name.indexOf(vm.search) != -1;
    			}
    		})
    	},
    	clazzList(){
    		let vm = this;
    		return vm.clazzs.filter(item=>{
    			if(item.name != null && item.grade != null){
    				 return item.grade.id === vm.gradeList;
    			}
    		})
    	}
    },
    methods:{
    	...mapActions(['getAllSurvey','saveOrUpdateSurvey','lineDeleteSurvey','batchDelethSurvey','beginSurvey','getAllGrade','getAllClazz','getAllCourse','getAllTeacher','getAllNaire']),
    	loadData(){
    		this.getAllSurvey().then(data=>{});
    	},
    	showClazz(){
    		if(this.title=='修改课调信息'){
    			this.form.clazzId = "";
    		}
    		this.flag = false;
    	},
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
	    handleStart(scope,row){
    		let vm = this;
	    	this.beginSurvey({id:row.id}).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 课调开启成功',
				        type: 'success'
			        });
	    		}else {
	    			vm.$message({
			            showClose: true, 
			            message: data.stauts+' 课调开启失败',
			            type: 'error'
			        });
	    		}
	    	});
	    },
	    handleView(scope,row){
	    	this.dialogViewVisible = true;
	    	this.viewVisible = [];
	        this.view = row;
	        row.qnVM.questionVMs.forEach(item=>{
	        	if(item.options.length != 0){
	        		this.viewVisible.unshift(item);
	        	}else{
	        		this.viewVisible.push(item);
	        	}
	        })
	    },
	    handleEdit(scope,row){
	    	this.title = "修改课调信息";
	    	this.flag = true;
	    	this.checked = false;
	    	this.dialogFormVisible = true;
	    	this.gradeList = row.clazzVM.grade;
	    	this.form = {
	    		id:row.id,
	    		clazzId:row.clazzVM.id,
	    		courseId:row.course.id,
	    		questionnaireId:row.qnVM.id,
	    		userId:row.user.id,
	    		surveydate:row.surveydate,
	    		average:row.average,
	    		status:row.status,
	    		code:row.code
	    	}
	    },
	    handleDelete(scope,row){
	    	let vm = this;
	    	this.lineDeleteSurvey({id:row.id}).then(data=>{
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
	    	let vm = this;
	    	this.title = "新增课调";
	    	this.gradeList = "";
	    	this.dialogFormVisible = true;
	    	this.flag = true;
	    	this.checked = false;
	    	this.form={

	    	}
	    },
	    batchDalete(){
	    	let vm = this;
	    	let arr = [];
	    	this.multipleSelection.forEach(item=>{
	    		arr.push(item.id)
	    	});
	    	this.batchDelethSurvey({ids:arr.join(",")}).then(data=>{
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
	    	this.saveOrUpdateSurvey(vm.form).then(data=>{
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
	    	});
	    	//开启课调
	    	if(this.checked){
	    		setTimeout(()=>{
		    		$("tr:last button:first").trigger('click');
		    	},1000);
	    	}
	    }
    }
}
</script>
<style scoped lang="scss">
  	.sManage {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}
  	}
</style>