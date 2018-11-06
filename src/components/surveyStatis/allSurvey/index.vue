<!-- 全部课调统计页面 -->
<template>
    <div class="allSurvey">
    	<div class="header">
    		<el-select style="width:120px" v-model="form.grade" placeholder="--全部年级--" @change="findGrade">
    			<el-option value="" key="1000"></el-option>
                <el-option v-for="(item,index) in grades" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
            <el-select style="width:120px" v-model="form.clazz" placeholder="--全部班级--" @change="findClazz">
            	<el-option value="" key="1000"></el-option>
                <el-option v-for="(item,index) in clazzs" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
            <el-select style="width:120px" v-model="form.course" placeholder="--全部课程--" @change="findCourse">
            	<el-option value="" key="1000"></el-option>
	            <el-option v-for="(item,index) in courses" :label="item.name" :value="item.id" :key="index"></el-option>
	        </el-select>        
	        <el-select style="width:160px" v-model="form.question" placeholder="--全部问卷--" @change="findQuestion">
	        	<el-option value="" key="1000"></el-option>
                <el-option v-for="(item,index) in naires" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
  	  		<el-input  placeholder="请输入班级名称" v-model="search" clearable style="width:180px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
	  	    <div class="header-opera">
	  	   		<el-button type="danger" @click="batchDalete">批量删除</el-button>
	  	    </div>
  	    </div>
		<el-table :data="searchList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column prop="clazzVM.grade.name" label="年级" width="100"></el-table-column>
            <el-table-column prop="clazzVM.name" label="班级" width="100"></el-table-column>
            <el-table-column prop="course.name" label="课程" width="120"></el-table-column>
            <el-table-column prop="qnVM.name" label="问卷" width="140"></el-table-column>
            <el-table-column prop="user.name" label="讲师" width="100"></el-table-column>
            <el-table-column prop="surveydate" label="课调时间"></el-table-column>
             <el-table-column prop="average" label="平均分" width="80"></el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" plain @click="handleView(scope.$index, scope.row)">预览</el-button>
                    <el-button size="mini" type="success" plain @click="handleDownload(scope.$index, scope.row)">下载</el-button>
                    <el-button size="mini" type="danger" plain @click="handleAnalysis(scope.$index, scope.row)">问卷分析</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 一级模态框 预览 -->
        <el-dialog :title="view.qnVM?view.qnVM.name:''" :visible.sync="dialogViewVisible" :modal-append-to-body='false' width="1000px" style="margin-top:-50px">
           <div class="main main-to">
				<div class="list">
					<div>班级：{{view.clazzVM?view.clazzVM.name:""}}</div>
					<div>讲师：{{view.user?view.user.name:""}}</div>
					<div>时间：{{view.surveydate}}</div>
					<div>课程：{{view.course?view.course.name:""}}</div>
					<div>平均分：{{view.average}}</div>
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
export default {
    data(){
	    return {
	     	form:{},
	     	search:'',
            view:{},
            viewVisible:[],
            multipleSelection:[],
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
    	selectList(){
    		let vm = this;
    		return this.changeMsg.filter(item=>{
    			if(vm.form.grade){
    				if(item.clazzVM && item.clazzVM.grade){
    					return item.clazzVM.grade.id == vm.form.grade;
    				}
    			}else if(vm.form.clazz){
    				if(item.clazzVM){
    					return item.clazzVM.id == vm.form.clazz;
    				}
    			}else if(vm.form.course){
    				if(item.course){
    					return item.course.id == vm.form.course;
    				}
    			}else if(vm.form.question){
    				if(item.qnVM){
    					return item.qnVM.id == vm.form.question;
    				}
    			}else {
    				return 1;
    			}
    		})
    	},
    	searchList(){
    		let vm = this;
    		return this.selectList.filter(item=>{
    			if(item.clazzVM && item.clazzVM.name != null){
    				return item.clazzVM.name.indexOf(vm.search) != -1;
    			}
    		})
    	}
    },
    methods:{
    	...mapActions(['getAllSurvey','Download','batchDelethSurvey','getAllGrade','getAllClazz','getAllCourse','getAllTeacher','getAllNaire']),
    	loadData(){
    		this.getAllSurvey().then(data=>{});
    	},
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
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
	    handleDownload(scope,row){
	    	let vm = this;
	    	this.Download({id:row.id}).then(data=>{
	    		vm.$message({
			        showClose: true,
			        message:' 开始下载文件',
			        type: 'success'
		        });
	    	}).catch(error=>{
	    		vm.$message({
		            showClose: true,
		            message: error,
		            type: 'warning'
		        });
	    	})
	    },
	    handleAnalysis(scope,row){

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
	    findGrade(e){
	    	this.form = {};
	    	this.form.grade = e;
	    },
	    findClazz(e){
	    	this.form = {};
	    	this.form.clazz = e;
	    },
	    findCourse(e){
	    	this.form = {};
	    	this.form.course = e;
	    },
	    findQuestion(e){
	    	this.form = {};
	    	this.form.question = e;
	    }
    }
}
</script>
<style scoped lang="scss">
  	.allSurvey {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}
  	}
</style>