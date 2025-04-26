import { axiosConfig } from "./axiosConfig.ts";
import axios from "axios";

const verify = axios.create(axiosConfig);

verify.interceptors.response.use((res) => res, async (err) => {
    if (err.response?.status === 401){
        try{
            await axios.get('refresh', axiosConfig);
            return verify.get('/verify', axiosConfig);
        }catch(err){
            return Promise.reject(err);
        }
    }
});


export const verifyAuth = async ()=>{
    return await verify.get('/verify', axiosConfig);
}
 



