import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LINK from '../store/Link';
import Loader from '../components/Loader';
import useAuth from '../store/Auth';
import TOKENNAME from '../store/Token';

const Chatroom = () => {
    const navigate = useNavigate();
    const currToken = localStorage.getItem(TOKENNAME);
    
    useEffect(() => {
        if (!currToken) {
            navigate("/login"); 
        }
    }, [currToken]);


    type ChatroomType = {
        _id: string;
        chatroomName: string;
        creatorUserId: number;
        creatorUsername: string;
        createdAt: Date;
        chatroomId: number;
    };

    type MessageType = {
        userId: number;
        username: string;
        message: string;
        timestamp: Date;
    };
    const {user} = useAuth();
    // console.log("Current User: " + user.username + "\tId: " + user.userId);
    const { chatroomId } = useParams();
    const [chatroomData, setChatroomData] = useState<ChatroomType>({
        _id: '',
        chatroomName: '',
        creatorUserId: 0,
        creatorUsername: '',
        createdAt: new Date(Date.now()),
        chatroomId: 0,
    });
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize Socket.IO connection
        const socketInstance = io(LINK); // Replace LINK with your backend URL
        setSocket(socketInstance);

        socketInstance.emit('joinChatroom', chatroomId); // Join the chatroom

        // Listen for new messages
        socketInstance.on('receiveMessage', (message: MessageType) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketInstance.disconnect(); // Clean up connection on component unmount
        };
    }, [chatroomId]);

    useEffect(() => {
        const fetchChatroom = async () => {
            try {
                const response = await fetch(LINK + `api/chatroom/getChatroom`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'Application/JSON',
                    },
                    body: JSON.stringify({
                        chatroomId: chatroomId,
                    }),
                });
                const data = await response.json();
                setChatroomData(data.chatroomInfo[0]);
            } catch (error) {
                console.error('Error fetching chatroom:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await fetch(LINK + `api/chat/fetch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'Application/JSON',
                    },
                    body: JSON.stringify({
                        chatroomId: chatroomId,
                    }),
                });
                const data = await response.json();
                setMessages(data.chatrooms); // Assuming the fetched data contains messages
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchChatroom();
        fetchMessages();
    }, [chatroomId]);

    const sendMessage = () => {
        if (newMessage.trim() && socket) {
            socket.emit('sendMessage', {
                chatroomName: chatroomId,
                message: newMessage,
                userId: user.userId, 
                username: user.username, 
            });
            setNewMessage('');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col justify-center items-center w-screen h-90vh">
            <h1>{chatroomData.chatroomName}</h1>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}</strong>: {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatroom;

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import LINK from '../store/Link';
// import Loader from '../components/Loader';

// const Chatroom = () => {
//     type ChatroomType = {
//         _id: string,
//         chatroomName: string,
//         creatorUserId: number,
//         creatorUsername: string,
//         createdAt: Date,
//         chatroomId: number
//     }
//     const { chatroomId } = useParams(); 
//     console.log(chatroomId);
//     const [chatroomData, setChatroomData] = useState<ChatroomType>({
//         _id: "",
//         chatroomName: "",
//         creatorUserId: 0,
//         creatorUsername: "",
//         createdAt: new Date(Date.now()),
//         chatroomId: 0
//     });
//     const [displayDate, setDisplayDate] = useState<string>("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchChatroom = async () => {
//             try {
//                 const response = await fetch(LINK + `api/chatroom/getChatroom`, {
//                     method:"POST",
//                     headers:{
//                         "Content-Type":"Application/JSON"
//                     },
//                     body: JSON.stringify({
//                         chatroomId: chatroomId
//                     })
//                 }); 
//                 const data = await response.json();
//                 console.log(data);
//                 setChatroomData(data.chatroomInfo[0]);
//                 const dateStr = data.chatroomInfo[0].createdAt;
//                 const unformattedDate = new Date(dateStr);
//                 const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
//                 const formattedDate = unformattedDate.toLocaleDateString('en-US', options);
//                 setDisplayDate(formattedDate);
//             } catch (error) {
//                 console.error('Error fetching chatroom:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchChatroom();
//     }, [chatroomId]);

//     if (loading) return <Loader />;

//     return (
//         <div className='flex flex-col justify-center items-center w-screen h-90vh'>
//             <h1>{chatroomData.chatroomName}</h1>
//             <h1>{chatroomData.creatorUsername}</h1>
//             <h1>{displayDate}</h1>
//         </div>
//     );
// };

// export default Chatroom;