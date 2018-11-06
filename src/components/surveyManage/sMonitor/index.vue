<!-- 课调监控页面 -->
<template>
    <div class="sMonitor">
   		<div class="header">
  	  		<el-input placeholder="按班级名称查询" v-model="search" clearable style="width:200px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
  	    </div>
		<el-table :data="surveyList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="clazzVM.name" label="班级" width="80"></el-table-column>
            <el-table-column prop="course.name" label="课程" width="120"></el-table-column>
            <el-table-column prop="qnVM.name" label="问卷" width="140"></el-table-column>
            <el-table-column prop="user.name" label="讲师" width="80"></el-table-column>
            <el-table-column prop="surveydate" label="课调时间"></el-table-column>
            <el-table-column prop="code" label="课调编号" width="80"></el-table-column>
             <el-table-column prop="status" label="课调状态" width="120"></el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                	<el-button size="mini" @click="handleStart(scope.$index, scope.row)">开启</el-button>
                    <el-button size="mini" type="success" plain @click="handleComing(scope.$index, scope.row)">查看进度</el-button>
                    <el-button size="mini" type="danger" plain @click="handleOver(scope.$index, scope.row)">结束</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 模态框 -->
        <el-dialog title="查看进度" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="500px">
            
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
            gradeList:"",
            dialogFormVisible:false,
	    }
    },
    created(){
    	this.loadData();
    },
    computed:{
    	...mapGetters(['changeMsg']),
    	surveyList(){
    		let vm = this;
    		return vm.changeMsg.filter(item=>{
    			if(item.clazzVM && item.clazzVM.name != null){
    				return item.clazzVM.name.indexOf(vm.search) != -1;
    			}
    		})
    	}
    },
    methods:{
    	...mapActions(['getAllSurvey','beginSurvey','stopSurvey']),
    	loadData(){
    		this.getAllSurvey().then(data=>{});
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
			        vm.loadData();
	    		}else {
	    			vm.$message({
			            showClose: true, 
			            message: data.stauts+' 课调开启失败',
			            type: 'error'
			        });
	    		}
	    	});
	    },
	    handleComing(scope,row){
	    	this.dialogFormVisible = true;
	    },
	    handleOver(scope,row){
	    	let vm = this;
	    	this.stopSurvey({id:row.id}).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 关闭课调成功',
				        type: 'success'
			        });
	    			vm.loadData();
	    		}else {
	    			vm.$message({
			            showClose: true, 
			            message: data.stauts+' 关闭课调失败',
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
	    }
    }
}
</script>
<style scoped lang="scss">
  	.sMonitor {
		.header {
			margin-bottom: 10px;
		}
  	}
</style>