<!-- 课调审核页面 -->
<template>
    <div class="sCheck">
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
                	<el-button size="mini" type="success" plain @click="handleCheck(scope.$index, scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 一级模态框 预览 -->
        <el-dialog :title="view.qnVM?view.qnVM.name:''" :visible.sync="dialogViewVisible" :modal-append-to-body='false' width="1000px" style="margin-top:-50px">
           <div class="checkInfo">
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
                    </li>
                </ul>
                <div class="checkBtn">
                    <el-button type="info" @click="checkFalse">审核不通过</el-button>
                    <el-button type="primary" @click="checkSuccess">审核通过</el-button>
                </div>
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
            gradeList:"",
            view:{},
            viewVisible:[],
            dialogViewVisible:false,
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
    	...mapActions(['getAllSurvey','checkSurvey']),
    	loadData(){
    		this.getAllSurvey().then(data=>{});
    	},
	    handleCheck(scope,row){
    		let vm = this;
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
            this.form.id = row.id;
	    },
        checkFalse(){
            this.dialogViewVisible = false;
            this.form.status = 0;
            this.save();
        },
        checkSuccess(){
            this.dialogViewVisible = false;
            this.form.status = 1;
            this.save();
        },
        save(){
            let vm = this;
            this.checkSurvey(this.form).then(data=>{
                if(data.stauts == 200){
                    vm.$message({
                        showClose: true,
                        message: data.stauts+' 审核通过',
                        type: 'success'
                    });
                    vm.loadData();
                }else {
                    vm.$message({
                        showClose: true,
                        message: data.stauts+' 审核不通过',
                        type: 'error'
                    });
                    vm.loadData();
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
  	.sCheck {
		.header {
			margin-bottom: 10px;
            position: relative;
		}
        .checkInfo{
            .list {
                display: flex;
                div{
                    flex: 1;
                    border:1px solid;
                    height: 80px;
                    text-align: center;
                    margin-bottom: 10px;
                    line-height: 80px;
                }
            }
            ul {
                li {
                    border:1px solid #333;
                    position: relative;
                    margin-top: 2px;
                    h3 {
                        margin:10px 20px;
                    }
                }
            }
            ul:after{
                content: "";
                display: block;
                height: 120px;
            }
            .checkBtn {
                margin-right: 50px;
                position: absolute;
                right: 50px;
                bottom: 30px;
            }
        }
  	}
</style>