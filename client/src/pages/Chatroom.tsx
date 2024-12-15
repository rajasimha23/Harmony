import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chatroom: React.FC = () => {
    const [username, setUsername] = useState("");
    const [tempUsername, setTempUsername] = useState("");
    const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        socket.on("chat message", (msg: { username: string; message: string }) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off("chat message");
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() && username) {
            socket.emit("chat message", { username, message: newMessage.trim() });
            setNewMessage("");
        } else {
            alert("Please enter a username and a message.");
        }
    };

    return (
        <div>
            { (!isUser) ? 
            (<><input
                type="text"
                placeholder="Enter your username"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px", width: "70%" }}
            />
            <button onClick={()=>{
                setUsername(tempUsername.trim());
                setIsUser(true);
            }}>Set Username</button>
            </>) : 
            (<><div
                style={{
                    border: "1px solid black",
                    height: "300px",
                    overflowY: "scroll",
                    marginBottom: "10px",
                    padding: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.username}: </strong>{msg.message}</p>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ marginRight: "10px", padding: "5px", width: "70%" }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
                Send
            </button>
            </>)}
        </div>
    );
};

export default Chatroom;