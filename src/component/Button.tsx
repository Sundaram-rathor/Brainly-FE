import { ReactElement } from "react"

interface ButtonProps{
    text?: string,
    variant?: 'primary' | 'secondary' ,
    startIcon?: ReactElement,
    onClick : ()=>void,
    auth?: boolean,
    loading?:boolean
}

const btnVariant = {
    'primary':'bg-purple-600 text-white ',
    'secondary': 'bg-purple-400 text-purple-500'
}

const defaultSetting = 'flex px-4 py-2 rounded-md font-light shadow-md cursor-pointer items-center'

export const Button = ({variant, text, startIcon, onClick,auth ,loading}: ButtonProps)=>{

    return <div>
        <button
        className={`${btnVariant[variant]} ${defaultSetting} ${auth ? " w-full justify-center": ""} ${loading ? "opacity-30":""}`}
        
        onClick={onClick}
        >
            <div className={startIcon ? 'pr-2':''}>
            {startIcon}
            </div>
            {text}</button>
    </div>
}