import axios from "axios";
import { useEffect,useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URI } from "../../config";
import { Card } from "../Card";
import { Button } from "../Button";
import { ChatIcon } from "../icons/ChatIcon";
import { motion } from "framer-motion";

interface DataItem {
    title: string;
    link: string;
    type: 'twitter' | 'youtube'
  }
  
export function SharePage() {
    const { shareLink } = useParams();
    const [data, setData] = useState<DataItem[] |null>(null);
    const [username, setUsername] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`${BACKEND_URI}/api/v1/brain/${shareLink}`);
                setData(response?.data?.content);
                setUsername(response?.data.username);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [shareLink]);

    // Initialize WebSocket connection once
    useEffect(() => {
        if (!username) return;

        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "join", payload: { roomId: username, role: "user" } }));
        };

        ws.onmessage = (event) => {
            console.log("Incoming message:", event.data);
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [username]);

    return (
        <div className="bg-gray-200 h-auto w-full px-30 py-30">
            <div>
                <h1 className="flex justify-between items-center text-5xl font-semibold text-gray-500 border-b-gray-100 p-4">
                    {username}'s Brainly
                    <div className="text-sm font-semibold">
                        <Button 
                            variant="primary" 
                            startIcon={<ChatIcon />}
                            text="Chat with Owner"
                            onClick={() => setModalOpen(true)}
                        />
                    </div>
                </h1>
                <div className="h-auto w-full bg-white p-4 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] rounded-md">
                    <div className="flex flex-wrap gap-4">
                        {data?.map(({ title, link, type }) => (
                            <div key={title}>
                                <Card title={title} link={link} type={type} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && socket && <ChatModal onClose={() => setModalOpen(false)} username={username} socket={socket} />}
        </div>
    );
}



interface ChatModalProps {
    onClose: () => void;
    username: string;
    socket: WebSocket;
}

export function ChatModal({ onClose, username, socket }: ChatModalProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const data = {
            type: "chat",
            payload: {
                message,
                roomId: username,
                sender: "user",
            },
        };

        socket.send(JSON.stringify(data));

        
        setMessages((prev) => [...prev, { text: message, sender: "user" }]);
        
        setMessage("");
    };

    useEffect(() => {
        const handleIncomingMessage = (event: MessageEvent) => {
            try {
                const incomingMessage = JSON.parse(event.data);
                
                
                if (incomingMessage.sender === "user") return; 

                console.log("Received:", incomingMessage);
                setMessages((prev) => [...prev, { text: incomingMessage.payload.message, sender: "owner" }]);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        socket.addEventListener("message", handleIncomingMessage);

        return () => {
            socket.removeEventListener("message", handleIncomingMessage);
        };
    }, [socket]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
        >
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Chat with Owner</h2>

                {/* Chat Messages */}
                <div ref={chatBoxRef} className="h-64 overflow-y-auto border p-2 rounded-md mb-4 bg-gray-100">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center">No messages yet.</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`p-2 my-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                <span className={`px-3 py-1 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                                    {msg.text}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Field */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="border p-2 w-full rounded-md"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button variant="primary" text="Send" onClick={sendMessage} />
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </motion.div>
    );
}
