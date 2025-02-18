import React, { useRef, useState } from "react"
import { CloseIcon } from "./icons/CloseIcon"
import { Button } from "./Button"
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URI } from "../config";

interface props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

enum ContentType {
    Youtube="youtube",
    Twitter= "twitter"
}

export function CreateContentModel({setOpen} : props){
    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>()
    const [type, setType] = useState(ContentType.Youtube)


    async function AddContent(){
        const title = titleRef.current?.value
        const link = linkRef.current?.value
        
        

        await axios.post(`${BACKEND_URI}/api/v1/content`,{
            title,
            link,
            type
        },{
            headers:{
                token: localStorage.getItem('token')
            }
        })
    }


    return <div className="min-h-96 min-w-96 rounded-md p-4 bg-white">
        <div className="flex justify-end "><CloseIcon setOpen={setOpen}/></div>
        <div className="flex justify-center text-2xl font-semibold">New Brainy</div>
        <div className="flex flex-col items-center justify-center mt-4">
            <Input referance={titleRef} placeholder="Title"/>
            <Input referance={linkRef} placeholder="Link"/>
            
            <div className="flex mt-4 gap-2">
                <Button text="Youtube" variant={type == "youtube" ? "primary": "secondary"} onClick={()=>{setType(ContentType.Youtube)}}/>
                <Button text="Twitter" variant={type == "twitter" ? "primary": "secondary"} onClick={()=>{setType(ContentType.Twitter)}}/>
            </div>
            <div className="mt-8">
            <Button text="Add" variant="primary" onClick={AddContent}/>
             </div>   
        </div>
    </div>
}