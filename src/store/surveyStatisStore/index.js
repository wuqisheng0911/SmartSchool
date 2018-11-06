// 课调统计仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{

	},
	getters:{},
	mutations:{},
	actions:{
		/*
			全部课调
		*/
		Download(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/result/downLoadQnResult',{params:obj}).then(({data})=>{
					setTimeout(()=>{
						window.location.href = "http://120.78.164.247:9999/result/downLoadQnResult?id="+obj.id;
					},100)
					resolve(data);
				}).catch(error=>{
					reject(error);
				})
			})
		},
	}
}