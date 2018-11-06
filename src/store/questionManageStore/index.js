// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		naire:[],
		question:[],
		naireById:{},
	},
	getters:{
		naires:state => state.naire,
		questions:state => state.question,
		naireByIds:state => state.naireById
	},
	mutations:{
		newnaires(state,data){
			state.naire = data;
		},
		newquestions(state,data){
			state.question = data;
		},
		newnaireByIds(state,data){
			state.naireById = data;
		},
	},
	actions:{
		/*
			问卷管理开始
		*/
		getAllNaire(context){
			return new Promise((resolve,reject)=>{
				axios.get("/questionnaire/findAllQuestionnaire").then(({data})=>{
					context.commit("newnaires",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		getNaireById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get("/questionnaire/findQuestionnaireVMById",{params:obj}).then(({data})=>{
					context.commit("newnaireByIds",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateNaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/questionnaire/saveOrUpdateQuestionnaire",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteNaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/deleteQuestionnaireById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethNaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		/*
			题库管理开始
		*/
		getAllQuestion(context){
			return new Promise((resolve,reject)=>{
				axios.get("/question/findAllQuestionVM").then(({data})=>{
					context.commit("newquestions",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/question/saveOrUpdateQuestion",qs.stringify(obj,{allowDots:true})).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/question/deleteQuestionById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
	}
}