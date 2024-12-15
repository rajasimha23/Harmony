import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LINK from '../store/Link';
import Loader from '../components/Loader';

const Chatroom = () => {
    type ChatroomType = {
        _id: string,
        chatroomName: string,
        creatorUserId: number,
        creatorUsername: string,
        createdAt: Date,
        chatroomId: number
    }
    const { chatroomId } = useParams(); 
    console.log(chatroomId);
    const [chatroomData, setChatroomData] = useState<ChatroomType>({
        _id: "",
        chatroomName: "",
        creatorUserId: 0,
        creatorUsername: "",
        createdAt: new Date(Date.now()),
        chatroomId: 0
    });
    const [displayDate, setDisplayDate] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChatroom = async () => {
            try {
                const response = await fetch(LINK + `api/chatroom/getChatroom`, {
                    method:"POST",
                    headers:{
                        "Content-Type":"Application/JSON"
                    },
                    body: JSON.stringify({
                        chatroomId: chatroomId
                    })
                }); 
                const data = await response.json();
                console.log(data);
                setChatroomData(data.chatroomInfo[0]);
                const dateStr = data.chatroomInfo[0].createdAt;
                const unformattedDate = new Date(dateStr);
                const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = unformattedDate.toLocaleDateString('en-US', options);
                setDisplayDate(formattedDate);
            } catch (error) {
                console.error('Error fetching chatroom:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChatroom();
    }, [chatroomId]);

    if (loading) return <Loader />;

    return (
        <div className='flex flex-col justify-center items-center w-screen h-90vh'>
            <h1>{chatroomData.chatroomName}</h1>
            <h1>{chatroomData.creatorUsername}</h1>
            <h1>{displayDate}</h1>
        </div>
    );
};

export default Chatroom;

// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// const Chatroom: React.FC = () => {
//     const [username, setUsername] = useState("");
//     const [tempUsername, setTempUsername] = useState("");
//     const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [isUser, setIsUser] = useState(false);

//     useEffect(() => {
//         socket.on("chat message", (msg: { username: string; message: string }) => {
//             setMessages((prevMessages) => [...prevMessages, msg]);
//         });

//         return () => {
//             socket.off("chat message");
//         };
//     }, []);

//     const sendMessage = () => {
//         if (newMessage.trim() && username) {
//             socket.emit("chat message", { username, message: newMessage.trim() });
//             setNewMessage("");
//         } else {
//             alert("Please enter a username and a message.");
//         }
//     };

//     return (
//         <div>
//             { (!isUser) ? 
//             (<><input
//                 type="text"
//                 placeholder="Enter your username"
//                 value={tempUsername}
//                 onChange={(e) => setTempUsername(e.target.value)}
//                 style={{ marginBottom: "10px", padding: "5px", width: "70%" }}
//             />
//             <button onClick={()=>{
//                 setUsername(tempUsername.trim());
//                 setIsUser(true);
//             }}>Set Username</button>
//             </>) : 
//             (<><div
//                 style={{
//                     border: "1px solid black",
//                     height: "300px",
//                     overflowY: "scroll",
//                     marginBottom: "10px",
//                     padding: "10px",
//                 }}
//             >
//                 {messages.map((msg, index) => (
//                     <p key={index}><strong>{msg.username}: </strong>{msg.message}</p>
//                 ))}
//             </div>
//             <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 style={{ marginRight: "10px", padding: "5px", width: "70%" }}
//                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
//                 Send
//             </button>
//             </>)}
//         </div>
//     );
// };

// export default Chatroom;