import { useRef } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import axios from "axios";
import { BACKEND_URI } from "../../config";
import { useNavigate } from "react-router-dom";

export function Signup(){
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();
    
    async function signup(){
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value; 

        await axios.post(`${BACKEND_URI}/api/v1/signup`, {
            
                username,
                password
            
        })
        navigate('/signin')
    
    }
    return <div className="flex items-center justify-center bg-gray-400 h-screen w-screen">
                
                <div className="bg-white rounded-md border border-gray-400 min-w-78  min-h-72 justify-center flex flex-col items-center p-4">
                    <div className="text-xl font-semibold mb-4">Sign Up</div>
                    <Input referance={usernameRef} placeholder="Username"/>
                    <Input referance={passwordRef} placeholder="Password"/>

                    <div className="mt-10 w-full">
                        <Button loading={false} auth={true} variant="primary" text="SignUp" onClick={signup}/>
                    </div>
                </div>

    </div>
}