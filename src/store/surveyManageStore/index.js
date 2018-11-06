// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		msg:[],
	},
	getters:{
		changeMsg:state=>state.msg,
	},
	mutations:{
		changeMsg(state,data){
			state.msg = data;
		},
	},
	actions:{
		//级联找到所有课调
		getAllSurvey(context){
			return new Promise((resolve,reject)=>{
				axios.get("/survey/findAllSurveyVM").then(({data})=>{
					context.commit("changeMsg",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		//保存或更新
		saveOrUpdateSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/survey/saveOrUpdateSurvey",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		//单个删除
		lineDeleteSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/deleteSurveyById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		//批量删除
		batchDelethSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		//开启课调
		beginSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/beginSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		//关闭课调
		stopSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/stopSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		//审核课调
		checkSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/checkSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		//预览课调
		previewSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/previewSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
	}
}