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
        const socketInstance = io(LINK); 
        setSocket(socketInstance);

        socketInstance.emit('joinChatroom', chatroomId);

        socketInstance.on('receiveMessage', (message: MessageType) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socketInstance.disconnect(); 
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
                setMessages(data.chatrooms); 
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