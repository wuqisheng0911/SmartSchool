<!-- 题目管理页面 -->
<template>
    <div class="quesManage">
   		<div class="header">
            <el-select v-model="select" placeholder="请选择题目类型">
                <el-option v-for="(item,index) in option" :label="item" :value="item" :key="index"></el-option>
            </el-select>
  	  		<el-input placeholder="请输入关键字" v-model="search" clearable style="width:250px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
	  	    <div class="header-opera">
	  	    	<el-button type="success" @click="add">添加</el-button>
                <el-button type="danger" @click="batchDelete">批量删除</el-button>
	  	    </div>
  	    </div>
  	    <div class="main access">
  	    	<ul>
  	    		<li v-for="(value,index) in questionList">
					<h3><input type="checkbox" v-model="checkbox" :value="value.id" class="checkBox">
                    序号<span>{{index+1}}</span>：<span>{{value.name}}</span></h3>
					<p v-if="value.options.length != 0" v-for="item in value.options">
						{{item.label}}:{{item.name}}
					</p>
					<div class="opera">
						<el-button type="success" @click="handleEdit(value)">
              	<i class="el-icon-edit-outline"></i>
              </el-button>
              <el-button type="danger" @click="handleDelete(value)">
                	<i class="el-icon-delete"></i>
              </el-button>
					</div>
  	    		</li>
  	    	</ul>
  	    </div>
  	    <!-- 1级模态框 修改，删除-->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="800px">
            <el-form :model="form">
                <el-form-item label="题目名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="题目类型" :label-width="formLabelWidth">
                    <el-select v-model="form.questionType" placeholder="请选择题目类型">
                        <el-option v-for="(item,index) in option" :label="item" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.questionType != '简答题'" label="题目选项" :label-width="formLabelWidth">
                    <el-table :data="form.options" border ref="singleTable" tooltip-effect="dark" style="width: 100%"  highlight-current-row>
			            <el-table-column type="index" label="序号" width="50"></el-table-column>
			            <el-table-column prop="label" label="label" width="80"></el-table-column>
			            <el-table-column prop="name" label="选项"></el-table-column>
			            <el-table-column prop="score" label="分值" width="80"></el-table-column>
			            <el-table-column label="操作" width="180">
			            	<template slot-scope="scope">
                                <el-popover placement="right" width="200" trigger="click">
                                    <el-form :model="changeLabel">
                                        <el-form-item label="选项" label-width="80px">
                                            <el-input :disabled="true" v-model="changeLabel.label" autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="描述" label-width="80px">
                                            <el-input v-model="changeLabel.name" autocomplete="off"></el-input>
                                        </el-form-item>
                                        <el-form-item label="分值" label-width="80px">
                                            <el-input v-model="changeLabel.score" autocomplete="off"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <el-button size="mini" slot="reference" @click="handleTableEdit(scope.$index, scope.row)">修改</el-button>
                                </el-popover>
				            	<el-button size="mini" @click="handleTableDelete(scope.$index, scope.row)">
			                      	删除
			                    </el-button>
		                    </template>
			            </el-table-column>
			        </el-table>
                </el-form-item>
                <el-form-item v-if="form.questionType != '简答题'" label="" :label-width="formLabelWidth">
					<i class="el-icon-circle-plus-outline" @click="addTr(grades)"></i>
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
import $ from 'jquery';
export default {
    data(){
	    return {
	     	search:'',
	     	title:'',
            changeLabel:{},
	     	dialogFormVisible:false,
            select:"单选题",
            option:['单选题','多选题','简答题'],
	     	form:{},
	     	formLabelWidth:'180px',
            checkbox:[],
            grades:[{
                label:"A",
                score:"5",
                name:"非常好",
                questionId:''
            },{
                label:"B",
                score:"4",
                name:"好",
                questionId:''
            },{
                label:"C",
                score:"3",
                name:"较好",
                questionId:''
            },{
                label:"D",
                score:"2",
                name:"一般",
                questionId:''
            },{
                label:"E",
                score:"1",
                name:"差",
                questionId:''
            }]
	    }
    },
    computed:{
        ...mapGetters(['questions']),
        selectList(){
            let vm = this;
            return this.questions.filter(item=>{
                if(item.questionType){
                     return vm.select.indexOf(item.questionType) != -1;
                }
            })
        },
    	questionList(){
    		let vm = this;
    		return this.selectList.filter(item=>{
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
    	...mapActions(['getAllQuestion','saveOrUpdateQuestion','lineDeleteQuestion','batchDelethQuestion']),
    	loadData(){
    		this.getAllQuestion().then(data=>{})
    	},
    	handleEdit(row){
            this.title = "修改题目信息";
            this.dialogFormVisible = true;
            this.form = {
                name:row.name,
                id:row.id,
                questionType:row.questionType,
                options:row.options.slice(0)
            }
        },
        handleDelete(row){
            let vm = this;
            this.lineDeleteQuestion({id:row.id}).then(data=>{
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
        batchDelete(){
            let vm = this;
            this.batchDelethQuestion({ids:vm.checkbox.join(",")}).then(data=>{
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
        handleTableEdit(scope,row){
            this.changeLabel = row;
        },
        handleTableDelete(scope,row){
            const length = this.form.options.length;
            this.form.options.splice(length-1,1);
        },
        addTr(row){
            const length = this.form.options.length;
            if( length < 5){
                this.form.options.push(row[length]);
            }
        },
        add(){
            this.title = "新增题目";
            this.dialogFormVisible = true;
            this.form = {
                questionType:"单选题",
                options:[], 
            };
        },
        save(){
            let vm = this;
            this.dialogFormVisible = false;
            let obj = {};
            if(vm.form.questionType == '简答题'){
                obj = {
                    id:vm.form.id,
                    name:vm.form.name,
                    questionType:vm.form.questionType
                }
            }else{
                obj = {
                    id:vm.form.id,
                    name:vm.form.name,
                    questionType:vm.form.questionType,
                    options:vm.form.options
                }
            }
            this.saveOrUpdateQuestion(obj).then(data=>{
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
<style>
    .quesManage .checkBox{
        width: 20px;height: 20px;cursor: pointer;
        position: relative;top:3px;
    }
	.quesManage .access {
		height: 400px;
		overflow-y: scroll;
	}
    .quesManage .access ul li {
        border:1px solid #333;
        margin-top: 20px;
        height: 180px; 
        position: relative;
    }
	.quesManage .opera {
		position: absolute;
		bottom:20px;
		right: 50px;
	}
	.el-table td, .el-table th{
		padding:0;
	}
	.quesManage .el-form-item i {
		font-size: 30px;
		float: right;
		margin-right: 50px;
		cursor:pointer;
	}
	.quesManage .el-form-item i:hover{
		color:orange;
	}
</style>
<style scoped lang="scss">
  	.quesManage {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}

  	}
</style>  