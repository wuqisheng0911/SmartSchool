<!-- 学校信息页面 -->
<template>
    <div class="schoolInfo">
	    <table :data="school.id">
	    	<tr>
	    		<td>校园名称</td>
	    		<td @click="inputChange" class="input">
	    			<span v-if='show'>{{school.name}}</span>
	    			<span v-else>
	    				<el-input v-model="input" placeholder="请输入id更换校园信息" style="width:200px"></el-input>
	    			</span>
	    		</td>
	    	</tr>
	    	<tr>
	    		<td>校园介绍</td>
	    		<td>{{school.description}}</td>
	    	</tr>
	    	<tr>
	    		<td>校园地址</td>
	    		<td>{{school.address}}</td>
	    	</tr>
	    	<tr>
	    		<td>校园电话</td>
	    		<td>{{school.telephone}}</td>
	    	</tr>
	    	<tr>
	    		<td>版权信息</td>
	    		<td>{{school.copyright}}</td>
	    	</tr>
	    </table>
      	<div class="btn">
	      	<el-button type="success" @click="update()">修改</el-button>
	        <el-button type="success" @click="newSc(input)">更换学校</el-button>
      	</div>
		 <!-- 模态框 -->
        <el-dialog title="修改校园信息" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="400px">
            <el-form :model="form">
                <el-form-item label="校园名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="校园介绍" :label-width="formLabelWidth">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="校园地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="校园电话" :label-width="formLabelWidth">
                    <el-input v-model="form.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="版权信息" :label-width="formLabelWidth">
                    <el-input v-model="form.copyright" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save(input)" :plain="true">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
    data(){
	    return {
	     	school:[],
       		show:true,
       		input:1,
       		form:{},
       		dialogFormVisible:false,
       		formLabelWidth:"180px",
	    }
    },
    created(){
    	let obj = {};
		obj.id = 1;
		this.getSchool(obj).then(data=>{
      		this.school = data.data;
    	}) 
    },
    computed:{
    },
    methods:{
    	...mapActions(['getSchool','saveOrUpdateSchool']),
    	update(){
    		this.dialogFormVisible = true;
    		let vm = this;
    		this.form = {
    			id:vm.school.id,
    			name:vm.school.name,
    			description:vm.school.description,
    			address:vm.school.address,
    			telephone:vm.school.telephone,
    			copyright:vm.school.copyright
    		}
    	},
        newSc(e){
        	let obj = {};
    		obj.id = e;
    		this.getSchool(obj).then(data=>{
          		this.school = data.data;
        	});
        	this.show = true;
        },
        inputChange(){
        	this.input = '';
        	this.show = false;
        },
        save(e){
        	let vm = this;
	    	this.dialogFormVisible = false;
	    	this.saveOrUpdateSchool(vm.form).then(data=>{
	    		if(data.stauts == 200){
	    			vm.$message({
				        showClose: true,
				        message: data.stauts+' 更新成功',
				        type: 'success'
			        });
			        this.getSchool({id:e}).then(data=>{
			        	this.school = data.data;
			        });
	    		}else {
	    			vm.$message({
			            showClose: true,
			            message: data.stauts+' 更新操作失败',
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
	.schoolInfo{
        table {
            border-collapse:collapse;
            font-size: 14px;
            tr {
                td{
                    border:1px solid;
                    height: 40px;
                    line-height: 40px;
                }
                td:first-child{
                    width: 200px;
                    text-align: center;
                }
                td:last-child{
                    width: 80%;
                    text-indent: 1em;
                }
            }
        } 
        .btn {
            position: absolute;
            bottom: 100px;
            right: 100px;
        }  
    }
</style>