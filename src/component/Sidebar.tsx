import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Logo } from "./icons/Logo";
import { SettingIcon } from "./icons/SettingIcon";
import { TwitterIcon } from "./icons/TwitterIcon";
import { YouTubeIcon } from "./icons/YoutubeIcon";
import { SideBarItem } from "./SidebarItem";
import { Button } from "./Button";
import { CloseIcon } from "./icons/CloseIcon";
import HamIcon from "./icons/HamIcon";

export function SideBar({ username,setSidebarOpen,setContentType }: { username: string, setSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>,setContentType:React.Dispatch<React.SetStateAction<string>> }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [chatAllowed, setChatAllowed] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isChatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
console.log(username)
    // Handle WebSocket connection
    useEffect(() => {
        if (chatAllowed) {
            const ws = new WebSocket("ws://localhost:8080");
            
            ws.onopen = () => {
                const data = {
                    type: "join",
                    payload: {
                        roomId: "testing",
                        role: "admin",
                    },
                };
                ws.send(JSON.stringify(data));
            };

            ws.onmessage = (event) => {
                setMessages((prev) => [...prev, event.data]);
            };

            setSocket(ws);
        } else {
            socket?.close();
            setSocket(null);
        }
    }, [chatAllowed]);

    // Send message
    const sendMessage = () => {
        if (socket && newMessage.trim() !== "") {
            const messageData = {
                type: "chat",
                payload: {
                    roomId: username,
                    message: newMessage,
                    role:'admin'
                },
            };
            socket.send(JSON.stringify(messageData));
            setNewMessage("");
        }
    };

    return (
        <div className="h-screen absolute top-0 left-0 bg-white min-w-72 max-w-72 border-r border-slate-500 fixed">
            {/* Logo Section */}
            <div className="p-6 text-2xl font-semibold text-gray-500 flex items-center justify-between">
                <div className="text-2xl font-semibold text-gray-500 flex">
                    <div className="text-purple-600">
                        <Logo />
                    </div>
                    <span className="px-2 py-1 rounded-md underline tracking-wider hover:tracking-widest duration-600">
                        Brainly.io
                    </span>
                </div>

                <div className="sm:block md:hidden"> <CloseIcon setOpen={setSidebarOpen}/></div>
            </div>

            {/* Sidebar Items */}
            <div className="pl-10 flex flex-col justify-between h-8/10">
                <div>
                    <SideBarItem startIcon={<HamIcon />} text="All Links" 
                    onClick={()=>{
                        setContentType('All Links')
                        setSidebarOpen(false)}} />
                    <SideBarItem startIcon={<YouTubeIcon />} text="Youtube" 
                    onClick={()=>{
                        setContentType('youtube')
                        setSidebarOpen(false)}}/>
                    <SideBarItem startIcon={<TwitterIcon />} text="Twitter" 
                    onClick={()=>{
                        setContentType('twitter')
                        setSidebarOpen(false)}} />
                </div>

                {/* Setting Button with Animated Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="w-full text-left flex items-center gap-2 py-2 px-4 rounded-md hover:bg-gray-100"
                    >
                        <SettingIcon />
                        <span>Setting</span>
                    </button>

                    {/* Animated Dropdown */}
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute left-0 bottom-12 w-56 bg-white shadow-lg border border-gray-200 rounded-md z-10"
                        >
                            <ul className="py-2 text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    Profile
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setChatOpen(true)}
                                >
                                    Chats
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                                    <span>Allow chats</span>
                                    <Button
                                        variant={chatAllowed ? "secondary" : "primary"}
                                        text={chatAllowed ? "Disable" : "Enable"}
                                        onClick={() => setChatAllowed((prev) => !prev)}
                                    />
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    Account Settings
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    Logout
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Chat Section */}
            {isChatOpen && (
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="fixed bottom-5 right-5 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-lg font-semibold">Chat</span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setChatOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-4 h-60 overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => {
                                const parsedData = JSON.parse(msg);
                                console.log(parsedData.payload.message)
                               return <div key={index} className={`mb-2 p-2 bg-gray-500 rounded-md flex ${parsedData.sender == 'admin' ? "text-left" : "text-right"} `}>
                                <div className={`${parsedData.sender == 'admin' ? "bg-red-500 " : "bg-green-500 "}`}>{parsedData.payload.message}</div>
                                </div>
                            })
                        ) : (
                            <p className="text-gray-500">No messages yet.</p>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 flex">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={()=> sendMessage()}
                            className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-md cursor-pointer"
                        >
                            Send
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
