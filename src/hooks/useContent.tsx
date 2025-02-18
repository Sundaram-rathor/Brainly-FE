import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URI } from "../config";


export function useContent(){
    const [contents,setContents] = useState([]);

    useEffect(()=>{
         axios.get(`${BACKEND_URI}/api/v1/content`,{
            headers:{
                token:localStorage.getItem('token')
            }
        }).then((Response)=>{setContents(Response?.data.contents)})
    },[])

    return contents
}