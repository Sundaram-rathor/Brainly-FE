import { ReactElement } from "react"

interface ItemsProps {
    startIcon: ReactElement,
    text: string,
    onClick:()=>void
}
export function SideBarItem({startIcon, text, onClick}: ItemsProps){
    return <div className="flex p-4 items-center text-xl text-gray-500 cursor-pointer hover:bg-gray-300 max-w-48 rounded-md transition-all duration-300"
            onClick={onClick}
    >
        {startIcon}
        <div className="pl-4">{text}</div>
    </div>
}