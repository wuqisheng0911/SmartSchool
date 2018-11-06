// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		school:[],
		grade:[],
		clazz:[],
		course:[],
		teacher:[],
	},
	getters:{
		schools:state=>state.school,
		grades:state=>state.grade,
		clazzs:state=>state.clazz,
		courses:state=>state.course,
		teachers:state=>state.teacher
	},
	mutations:{
		newschool(state,data){
			state.school = data;
		},
		newgrade(state,data){
			state.grade = data;
		},
		newclazz(state,data){
			state.clazz = data;
		},
		newcourse(state,data){
			state.course = data;
		},
		newteacher(state,data){
			state.teacher = data;
		}
	},
	actions:{
		/*
			校园信息管理模块开始
		*/
		getSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get("/school/findById",{params:obj}).then(({data})=>{
					context.commit("newschool",data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/school/saveOrUpdate",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		/*
			年级管理模块开始
		*/
		getAllGrade(context){
			return new Promise((resolve,reject)=>{
				axios.get("/grade/findAll").then(({data})=>{
					context.commit("newgrade",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/grade/saveOrUpdate",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/batchDelete',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		/*
			班级管理模块开始
		*/
		getAllClazz(context){
			return new Promise((resolve,reject)=>{
				axios.get("/clazz/findAllVM").then(({data})=>{
					context.commit("newclazz",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/clazz/saveOrUpdateClazz",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/deleteClazzById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		/*
			课程管理模块开始
		*/
		getAllCourse(context){
			return new Promise((resolve,reject)=>{
				axios.get("/course/findAllCourse").then(({data})=>{
					context.commit("newcourse",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/course/saveOrUpdate",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/course/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/course/batchDelete',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		/*
			教师管理模块开始
		*/
		getAllTeacher(context){
			return new Promise((resolve,reject)=>{
				axios.get("/user/findAll").then(({data})=>{
					context.commit("newteacher",data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		saveOrUpdateTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post("/user/saveOrUpdate",qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				})
			})
		},
		lineDeleteTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/user/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
		batchDelethTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/user/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		}
	}
}