
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LINK from '../store/Link';
import Loader from '../components/Loader';
import useAuth from '../store/Auth';
import { Send } from 'lucide-react';

const Chatroom = () => {
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);

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

    const { user } = useAuth();
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
    const [areMessagesSet, setMessagesSet] = useState<boolean>(false);
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
                setMessagesSet(true);
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

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) return <Loader />;

    function returnDisplayTime(msgDate: any): string {
        if (!areMessagesSet) return "";
        const date = (msgDate instanceof Date) ? msgDate : new Date(msgDate);
    
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center w-screen h-[90vh]">
                <h1 className="text-5xl text-black font-extrabold text-center mb-8">{chatroomData.chatroomName}</h1>
                <div className="w-5/12">
                    <div className="bg-[#c7c7c7] chat-window h-[calc(90vh-200px)] overflow-y-auto p-8 rounded-t-xl flex flex-col justify-start items-start scrollbar-rounded shadow-2xl">
                        {messages.map((msg, index) => {
                            const currentMessageDate = new Date(msg.timestamp);
                            const previousMessageDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                            const isNewDay = !previousMessageDate || currentMessageDate.toDateString() !== previousMessageDate.toDateString();

                            return (
                                <React.Fragment key={index}>
                                    {isNewDay && (
                                        <div key={`date-${index}`} className="w-full text-center my-4">
                                            <span className="bg-[#c7c7c7] text-black py-2 px-4 rounded-lg">
                                                {formatDate(currentMessageDate)}
                                            </span>
                                        </div>
                                    )}
                                    {msg.username === user.username ? (
                                        <div className="bg-blue-600 mb-3 py-2 px-2 rounded-xl max-w-md break-words self-end">
                                            <strong className="text-gray-200">{"You"}</strong>
                                            <br />
                                            <p className="text-white">{msg.message}</p>
                                            <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-600 mb-3 py-2 px-2 rounded-xl max-w-md break-words">
                                            <strong className="text-gray-200">{msg.username}</strong>
                                            <br />
                                            <p className="text-white">{msg.message}</p>
                                            <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className="flex w-full">
                        <input
                            className="w-full h-12 px-3 rounded-bl-xl border-0"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message"
                        />
                        <button 
                            onClick={sendMessage}
                            className="bg-blue-600 hover:bg-blue-400 text-white p-3 rounded-br-xl transition-colors duration-200"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Chatroom;