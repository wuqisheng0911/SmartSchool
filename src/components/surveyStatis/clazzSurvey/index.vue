<!-- 班级课调统计页面 -->
<template>
    <div class="clazzSurvey">
    	<div class="header">
    		<el-select style="width:120px" v-model="form.grade" placeholder="--全部年级--" @change="form.clazz = null">
    			<el-option value="" key="1000"></el-option>
                <el-option v-for="(item,index) in grades" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
            <el-select style="width:120px" v-model="form.clazz" placeholder="--全部班级--" @change="form.grade = null">
           		<el-option value="" key="1000"></el-option>
                <el-option v-for="(item,index) in clazzs" :label="item.name" :value="item.id" :key="index"></el-option>
            </el-select>
  	  		<el-input  placeholder="请输入班级名称" v-model="search" clearable style="width:180px">
  	  			<i class="el-icon-search" slot="suffix"> </i>
  	  		</el-input>
  	    </div>
		<div class="card">
			<ul>
				<li v-for="(item,index) in searchList">
					<div>
						<img :src="img">
					</div>
					<div>
						<h3>{{item.clazzVM?item.clazzVM.name:""}}</h3>
						<p>平均分：{{item.average}}</p>
						<p>最近分：</p>
					</div>
				</li>
			</ul>
		</div>
    </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import light from "../../../assets/light.png"; 
export default {
    data(){
	    return {
	     	form:{},
	     	search:'',
	     	img:light
	    }
    },
    created(){
    	this.loadData();
    	this.getAllGrade().then(data=>{});
    	this.getAllClazz().then(data=>{});
    },
    computed:{
    	...mapGetters(['changeMsg','grades','clazzs']),
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
    			}else {
    				return 1;
    			}
    		})
    	},
    	searchList(){
    		let vm = this;
    		return this.selectList.filter(item=>{
    			if(item.clazzVM && item.clazzVM.name){
    				return item.clazzVM.name.indexOf(vm.search) != -1;
    			}
    		})
    	}
    },
    methods:{
    	...mapActions(['getAllSurvey','getAllGrade','getAllClazz']),
    	loadData(){
    		this.getAllSurvey().then(data=>{});
    	}
    }
}
</script>
<style scoped lang="scss">
  	.clazzSurvey {
		.header {
			margin-bottom: 10px;
		}
		.card {
			height: 400px;
			overflow-y: scroll;
			ul {
				li {
					border:1px solid;
					margin: 10px 20px 0 0;
					background-color: rgba(76, 140, 124, 1);
					border-radius:10px;
					width: 250px;
					float: left;
					cursor: pointer;
					div {
						width: 50%;
						float: left;
						height: 120px;
						color:white;
						img {
							height: 100px;
						}
						h3 {
							font-size: 18px;
							margin:10px 0 20px;
						}
						p {
							font-size: 14px;
						}
					}
				}
			}
		}
  	}
</style>