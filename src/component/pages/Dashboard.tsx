import { useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { CreateContentModel } from "../CreateContentModel";
import { SideBar } from "../Sidebar";
import { useContent } from "../../hooks/useContent";
import axios from "axios";
import { BACKEND_URI } from "../../config";
import HamIcon from "../icons/HamIcon";

function Dashboard() {
  const [open, setOpen] = useState(false);
  const [share, setShare] = useState(false);
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [contentType, setContentType] = useState('All Links')

  const contents = useContent();
  console.log(username);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-200">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4">
        <Button startIcon={<HamIcon/>} variant="primary" onClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-72 fixed md:relative bg-white md:block ${sidebarOpen ? "block" : "hidden"}`}>
        <SideBar username={username} setSidebarOpen={setSidebarOpen} setContentType={setContentType}/>
      </div>

      {/* Main Content */}
      <div className="p-4 w-full  flex-1">
        <div className="flex  justify-end gap-4">
          <Button
            text="Add Content"
            variant="primary"
            onClick={() => setOpen((prev) => !prev)}
            startIcon={<PlusIcon />}
          />
          <Button
            text={share ? "Share" : "Stop Sharing"}
            variant="secondary"
            onClick={async () => {
              setShare((prev) => !prev);
              const response = await axios.post(
                `${BACKEND_URI}/api/v1/brain/share`,
                {
                  share: share,
                },
                {
                  headers: {
                    token: localStorage.getItem("token"),
                  },
                }
              );

              const shareUrl = `http://localhost:5173/api/v1/brain/${response.data.hash}`;
              setUsername(response.data.username);

              alert(shareUrl);
            }}
            startIcon={<ShareIcon />}
          />
        </div>

        {/* Cards Section */}
        <div className="flex flex-wrap gap-4 mt-10 justify-center md:justify-start">
            {contentType == 'All Links' 
            && 
             contents.map(({ type, link, title }, index) => (
            <Card key={index} title={title} link={link} type={type} />
          ))}

            {contents.map(({ type, link, title }, index) => {
              if(contentType == type){
                return <Card key={index} title={title} link={link} type={type} />
              }
            
            })}
            

          {/* */}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Transparent Background */}
            <div className="absolute inset-0 bg-slate-500 opacity-50"></div>

            {/* Modal Content */}
            <div className="relative bg-white p-4 rounded-md shadow-lg z-10">
              <CreateContentModel setOpen={setOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;