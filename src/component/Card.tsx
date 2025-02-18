import { ShareIcon } from "./icons/ShareIcon";

interface CardProps {
    title: string,
    link: string,
    type: 'twitter' | 'youtube'
}

export function Card({title , link, type} : CardProps){
    
    return <div className="pt-4 border rounded-md">
        <div className="p-4 bg-white rounded-md border border-gray-200 max-w-72  min-w-72 h-auto">
            <div className="flex items-center w-full justify-between  ">
                 <div className="flex items-center "> 
                     <div className="mr-2"><ShareIcon/></div>
                     {title}
                 </div>
                 <div className="flex">
                     <div className="mr-2"><ShareIcon/></div>
                     <div className="mr-2"><ShareIcon/></div>
                 </div>
            </div>
            <div className="pt-8">
                
                {type === 'youtube' && <iframe 
                 className="w-full" 
                 src={`https://www.youtube.com/embed/${link.split('=')[1]}`}
                 title="YouTube video player" 
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                 referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
     
                 </iframe>}

                
                 {type ==='twitter' && <blockquote className="twitter-tweet">
                   <a href={`https://twitter.com/username/status/${link.split('/')[5]}`}></a> 
                 </blockquote>}

                 
                 

            </div>
        </div>
    </div>
}