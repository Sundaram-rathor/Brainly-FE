
export function Input({placeholder, referance}: {
    placeholder: string,
    referance:any
}){
    return <div>
        <input ref={referance} type="text" placeholder={placeholder}  className="py-2 px-8 mt-2 shadow-md border border-gray-400 rounded-md mb-4 w-full"/>
    </div>
}