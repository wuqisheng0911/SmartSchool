<!-- 问卷管理页面 -->
<template>
    <div class="naireManage">
     	<div class="header">
  	  		<el-input placeholder="请输入关键字" v-model="search" clearable style="width:250px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
	  	    <div class="header-opera">
	  	    	<el-button type="success" @click="add">添加</el-button>
	  	   		<el-button type="danger" @click="batchDalete">批量删除</el-button>
	  	    </div>
  	    </div>
  	    <el-table :data="naireList" border  height="400"  ref="multipleTable" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"> </el-table-column>
            <el-table-column prop="name" label="问卷名称" width="240"></el-table-column>
            <el-table-column prop="description" label="问卷描述"></el-table-column>
            <el-table-column label="操作" width="240">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" plain @click="handleView(scope.$index, scope.row)">预览</el-button>
                    <el-button size="mini" type="success" plain @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                    <el-button size="mini" type="danger" plain @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 一级模态框 更新和修改 -->
        <el-dialog :title="title" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="800px">
            <el-form :model="form">
                <el-form-item label="问卷名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="问卷描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="题目列表" :label-width="formLabelWidth">
                   <el-button style="width:80%" @click="select(form.id)">点击选择</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 二级模态框 -->
        <el-dialog title="选择题目" :visible.sync="dialogTransferVisible" :modal-append-to-body='false' width="700px">
            <el-transfer v-model="value1" :data="dataList" :titles="['题目', '选中']"></el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTransferVisible = false">取 消</el-button>
                <el-button type="primary" @click="save" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 一级模态框 预览 -->
        <el-dialog :title="viewVisible" :visible.sync="dialogViewVisible" :modal-append-to-body='false' width="800px" style="margin-top:-50px">
           <div class="main main-to">
                <ul>
                    <li v-for="(value,index) in view">
                        <h3>序号<span>{{index+1}}</span>：<span>{{value.name}}</span>(<span>{{value.questionType}}</span>)</h3>
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
            title:'',
	     	form:{},
	     	search:'',
            value1:[],
            checkList:[],
            view:[],
            viewVisible:"",
            formLabelWidth:'180px',
            multipleSelection:[],
            dialogViewVisible:false,
            dialogFormVisible:false,
            dialogTransferVisible:false,
	    }
    },
    computed:{
        ...mapGetters(['naires','questions','newnaireByIds']),
    	naireList(){
    		let vm = this;
    		return vm.naires.filter(item=>{
    			if(item.name != null){
    				 return item.name.indexOf(vm.search) != -1;
    			}
    		})
    	},
        dataList(){
            let arr = [];
            this.questions.forEach((item,index)=>{
                var obj = {
                    key:item.id,
                    label:"("+item.questionType+")"+item.name,
                }
                if(item.options.length != 0){
                    arr.unshift(obj);
                }else{
                    arr.push(obj);
                }
            });
            return arr;
        },
    },
    created(){
    	this.loadData();
    },
    methods:{
    	...mapActions(['getAllNaire','getNaireById','saveOrUpdateNaire','lineDeleteNaire','batchDelethNaire']),
    	loadData(){
    		this.getAllNaire().then(data=>{})
    	},
    	handleSelectionChange(val) {
	        this.multipleSelection = val;
	    },
        handleView(scope,row){
            this.view = [];
            this.dialogViewVisible = true;
            this.viewVisible = row.name;
            let vm =this;
            this.getNaireById({id:row.id}).then(data=>{
                let arr = [];
                arr = data.questionVMs;
                arr.forEach(item=>{
                    if(item.options.length != 0){
                        vm.view.unshift(item);
                    }else{
                        vm.view.push(item);
                    }
                });
            });
            
        },
    	handleEdit(scope,row){
            this.title = "修改问卷信息";
            this.dialogFormVisible = true;
            let vm = this;
            this.form = {
                name:row.name,
                id:row.id,
                description:row.description,
                questionIds:[]
            }
        },
        handleDelete(scope,row){
            let vm = this;
            this.lineDeleteNaire({id:row.id}).then(data=>{
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
            this.title = "新增问卷";
            this.dialogFormVisible = true;
            let vm = this;
            this.form = {
                questionIds:[],
            };
        },
        select(key){
            this.dialogTransferVisible = true;
            let vm = this;
            this.value1 = [];
            if(this.title == "修改问卷信息"){
                this.getNaireById({id:key}).then(data=>{
                    data.questionVMs.forEach(item=>{
                        vm.value1.push(item.id)
                    })
                })
            }
        },
        batchDalete(){
            let vm = this;
            let arr = [];
            this.multipleSelection.forEach(item=>{
                arr.push(item.id)
            });
            this.batchDelethNaire({ids:arr.join(",")}).then(data=>{
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
            this.dialogTransferVisible = false;
            let ques = this.form.questionIds;
            this.value1.forEach(item=>{
                ques.push(item);
            });
            this.form.questionIds = Array.from(new Set(ques)).join(",");
            this.saveOrUpdateNaire(vm.form).then(data=>{
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
<style scoped lang="scss">
  	.naireManage {
		.header {
			margin-bottom: 10px;
			.header-opera {
				float: right;
				margin-right: 50px;
			}
		}
  	}
</style>