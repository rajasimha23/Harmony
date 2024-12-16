
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LINK from '../store/Link';
import Loader from '../components/Loader';
import useAuth from '../store/Auth';
import TOKENNAME from '../store/Token';

const Chatroom = () => {
    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement | null>(null);
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
                <h1 className='text-5xl text-white text-center mb-8'>{chatroomData.chatroomName}</h1>
                <div className='w-5/12'>
                    <div className="bg-[#c7c7c7] chat-window h-[calc(90vh-200px)] overflow-y-auto p-8 rounded-xl flex flex-col justify-start items-start">
                        {messages.map((msg, index) => {
                            const currentMessageDate = new Date(msg.timestamp);
                            const previousMessageDate = index > 0 ? new Date(messages[index - 1].timestamp) : null;
                            const isNewDay = !previousMessageDate || currentMessageDate.toDateString() !== previousMessageDate.toDateString();

                            return (
                                <>
                                    {isNewDay && (
                                        <div key={`date-${index}`} className="w-full text-center my-4">
                                            <span className="bg-[#c7c7c7] text-black py-2 px-4 rounded-lg">
                                                {formatDate(currentMessageDate)}
                                            </span>
                                        </div>
                                    )}
                                    {(msg.username === user.username) ? (
                                        <div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words self-end'>
                                            <strong>{"You"}</strong><br />{msg.message}<br />
                                            <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
                                        </div>
                                    ) : (
                                        <div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words'>
                                            <strong>{msg.username}</strong><br />{msg.message}<br />
                                            <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
                                        </div>
                                    )}
                                </>
                            );
                        })}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className="chat-input mt-3">
                        <input
                            className='w-10/12 h-10 rounded-lg px-3'
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message"
                        />
                        <button onClick={sendMessage} className='bg-[#707070] w-20 h-11 text-white rounded-xl text-md text-center ml-2'>{"Send"}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatroom;

// import { useEffect, useState,  useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { io, Socket } from 'socket.io-client';
// import LINK from '../store/Link';
// import Loader from '../components/Loader';
// import useAuth from '../store/Auth';
// import TOKENNAME from '../store/Token';

// const Chatroom = () => {
//     const navigate = useNavigate();
//     const chatEndRef = useRef<HTMLDivElement | null>(null);
//     const currToken = localStorage.getItem(TOKENNAME);
    
//     useEffect(() => {
//         if (!currToken) {
//             navigate("/login"); 
//         }
//     }, [currToken]);


//     type ChatroomType = {
//         _id: string;
//         chatroomName: string;
//         creatorUserId: number;
//         creatorUsername: string;
//         createdAt: Date;
//         chatroomId: number;
//     };

//     type MessageType = {
//         userId: number;
//         username: string;
//         message: string;
//         timestamp: Date;
//     };
//     const {user} = useAuth();
//     const { chatroomId } = useParams();
//     const [chatroomData, setChatroomData] = useState<ChatroomType>({
//         _id: '',
//         chatroomName: '',
//         creatorUserId: 0,
//         creatorUsername: '',
//         createdAt: new Date(Date.now()),
//         chatroomId: 0,
//     });
//     const [messages, setMessages] = useState<MessageType[]>([]);
//     const [newMessage, setNewMessage] = useState<string>('');
//     const [areMessagesSet, setMessagesSet] = useState<boolean>(false);
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const socketInstance = io(LINK); 
//         setSocket(socketInstance);

//         socketInstance.emit('joinChatroom', chatroomId);

//         socketInstance.on('receiveMessage', (message: MessageType) => {
//             setMessages((prevMessages) => [...prevMessages, message]);
//         });

//         return () => {
//             socketInstance.disconnect(); 
//         };
//     }, [chatroomId]);

//     useEffect(() => {
//         const fetchChatroom = async () => {
//             try {
//                 const response = await fetch(LINK + `api/chatroom/getChatroom`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'Application/JSON',
//                     },
//                     body: JSON.stringify({
//                         chatroomId: chatroomId,
//                     }),
//                 });
//                 const data = await response.json();
//                 setChatroomData(data.chatroomInfo[0]);
//             } catch (error) {
//                 console.error('Error fetching chatroom:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchMessages = async () => {
//             try {
//                 const response = await fetch(LINK + `api/chat/fetch`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'Application/JSON',
//                     },
//                     body: JSON.stringify({
//                         chatroomId: chatroomId,
//                     }),
//                 });
//                 const data = await response.json();
//                 setMessages(data.chatrooms); 
//                 setMessagesSet(true);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchChatroom();
//         fetchMessages();
//     }, [chatroomId]);

//     const sendMessage = () => {
//         if (newMessage.trim() && socket) {
//             socket.emit('sendMessage', {
//                 chatroomName: chatroomId,
//                 message: newMessage,
//                 userId: user.userId, 
//                 username: user.username, 
//             });
//             setNewMessage('');
//         }
//     };

//     const scrollToBottom = () => {
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     if (loading) return <Loader />;

//     function returnDisplayTime(msgDate: any): string {
//         if (!areMessagesSet) return "";
//         const date = (msgDate instanceof Date) ? msgDate : new Date(msgDate);
    
//         return date.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false,
//         });
//     }

//     return (
//         <>
//             <div className="flex flex-col justify-center items-center w-screen h-90vh bg-[#435545]">
//                 <h1 className='text-5xl text-white text-center mb-8'>{chatroomData.chatroomName}</h1>
//                 <div className='w-5/12'>
//                     <div className="bg-[#c7c7c7] chat-window h-max-64 h-min-64 p-8 rounded-xl flex flex-col justify-start items-start overflow-y-auto">
//                         {messages.map((msg, index) => (
//                             (msg.username == user.username) ? (<div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words self-end'>
//                                 <strong>{"You"}</strong><br />{msg.message}<br />
//                                 <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
//                             </div>) :
//                             (<div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words'>
//                                 <strong>{msg.username}</strong><br />{msg.message}<br />
//                                 <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
//                             </div>)
//                         ))}
//                     </div>
//                     <div className="chat-input mt-3">
//                         <input
//                         className='w-10/12 h-10 rounded-lg px-3'
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Type your message"
//                         />
//                         <button onClick={sendMessage} className='bg-[#232323] w-20 h-11 text-white rounded-xl text-md text-center ml-2'>{"Send"}</button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Chatroom;


// import { useEffect, useState, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { io, Socket } from 'socket.io-client';
// import LINK from '../store/Link';
// import Loader from '../components/Loader';
// import useAuth from '../store/Auth';
// import TOKENNAME from '../store/Token';

// const Chatroom = () => {
//     const navigate = useNavigate();
//     const chatEndRef = useRef<HTMLDivElement | null>(null);
//     const currToken = localStorage.getItem(TOKENNAME);
    
//     useEffect(() => {
//         if (!currToken) {
//             navigate("/login"); 
//         }
//     }, [currToken]);

//     type ChatroomType = {
//         _id: string;
//         chatroomName: string;
//         creatorUserId: number;
//         creatorUsername: string;
//         createdAt: Date;
//         chatroomId: number;
//     };

//     type MessageType = {
//         userId: number;
//         username: string;
//         message: string;
//         timestamp: Date;
//     };

//     const { user } = useAuth();
//     const { chatroomId } = useParams();
//     const [chatroomData, setChatroomData] = useState<ChatroomType>({
//         _id: '',
//         chatroomName: '',
//         creatorUserId: 0,
//         creatorUsername: '',
//         createdAt: new Date(Date.now()),
//         chatroomId: 0,
//     });
//     const [messages, setMessages] = useState<MessageType[]>([]);
//     const [newMessage, setNewMessage] = useState<string>('');
//     const [areMessagesSet, setMessagesSet] = useState<boolean>(false);
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const socketInstance = io(LINK); 
//         setSocket(socketInstance);

//         socketInstance.emit('joinChatroom', chatroomId);

//         socketInstance.on('receiveMessage', (message: MessageType) => {
//             setMessages((prevMessages) => [...prevMessages, message]);
//         });

//         return () => {
//             socketInstance.disconnect(); 
//         };
//     }, [chatroomId]);

//     useEffect(() => {
//         const fetchChatroom = async () => {
//             try {
//                 const response = await fetch(LINK + `api/chatroom/getChatroom`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'Application/JSON',
//                     },
//                     body: JSON.stringify({
//                         chatroomId: chatroomId,
//                     }),
//                 });
//                 const data = await response.json();
//                 setChatroomData(data.chatroomInfo[0]);
//             } catch (error) {
//                 console.error('Error fetching chatroom:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchMessages = async () => {
//             try {
//                 const response = await fetch(LINK + `api/chat/fetch`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'Application/JSON',
//                     },
//                     body: JSON.stringify({
//                         chatroomId: chatroomId,
//                     }),
//                 });
//                 const data = await response.json();
//                 setMessages(data.chatrooms); 
//                 setMessagesSet(true);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchChatroom();
//         fetchMessages();
//     }, [chatroomId]);

//     const sendMessage = () => {
//         if (newMessage.trim() && socket) {
//             socket.emit('sendMessage', {
//                 chatroomName: chatroomId,
//                 message: newMessage,
//                 userId: user.userId, 
//                 username: user.username, 
//             });
//             setNewMessage('');
//         }
//     };

//     const scrollToBottom = () => {
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     if (loading) return <Loader />;

//     function returnDisplayTime(msgDate: any): string {
//         if (!areMessagesSet) return "";
//         const date = (msgDate instanceof Date) ? msgDate : new Date(msgDate);
    
//         return date.toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false,
//         });
//     }

//     return (
//         <>
//             <div className="flex flex-col justify-center items-center w-screen h-[90vh]">
//                 <h1 className='text-5xl text-white text-center mb-8'>{chatroomData.chatroomName}</h1>
//                 <div className='w-5/12'>
//                     <div className="bg-[#c7c7c7] chat-window h-[calc(90vh-200px)] overflow-y-auto p-8 rounded-xl flex flex-col justify-start items-start">
//                         {messages.map((msg, index) => (
//                             (msg.username === user.username) ? (
//                                 <div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words self-end'>
//                                     <strong>{"You"}</strong><br />{msg.message}<br />
//                                     <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
//                                 </div>
//                             ) : (
//                                 <div key={index} className='bg-[#319b48] mb-3 py-2 px-2 rounded-xl max-w-md break-words'>
//                                     <strong>{msg.username}</strong><br />{msg.message}<br />
//                                     <p className='text-right text-xs'>{returnDisplayTime(msg.timestamp)}</p>
//                                 </div>
//                             )
//                         ))}
//                         {/* Dummy element to scroll to */}
//                         <div ref={chatEndRef}></div>
//                     </div>
//                     <div className="chat-input mt-3">
//                         <input
//                             className='w-10/12 h-10 rounded-lg px-3'
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Type your message"
//                         />
//                         <button onClick={sendMessage} className='bg-[#444444] w-20 h-11 text-white rounded-xl text-md text-center ml-2'>{"Send"}</button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Chatroom;

