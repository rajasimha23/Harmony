
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LINK from '../store/Link';
import Loader from '../components/Loader';
import useAuth from '../store/Auth';
import { Send } from 'lucide-react';
import { FaPenToSquare } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

  const Chatroom = () => {
      const { chatroomId } = useParams();
      const {isLoggedIn} = useAuth();
      const [messages, setMessages] = useState<MessageType[]>([]);
      
      useEffect(() => {
          if (!isLoggedIn) {
              navigate("/login"); 
            }
        }, [isLoggedIn]);
        
        useEffect(() => {
            fetchChatroom();
        fetchMessages();
    }, [chatroomId]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
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
    
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [chatroomData, setChatroomData] = useState<ChatroomType>({
        _id: '',
        chatroomName: '',
        creatorUserId: 0,
        creatorUsername: '',
        createdAt: new Date(Date.now()),
        chatroomId: 0,
    });
    const [newMessage, setNewMessage] = useState<string>('');
    const [areMessagesSet, setMessagesSet] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<MessageType | null>(null);


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
    
    async function deleteMessage (msg:any) {
        const data = {
            timestamp: msg.timestamp, 
            userId: msg.userId,
        };
        
        if (msg.username != user.username && !user.isAdmin) {
            toast("User Not authorized");
            return;
        }
        
        const response = await fetch(LINK + "api/chat/delete", {
            method:"PATCH",
            headers:{
                "Content-type":"Application/JSON"
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            toast("Successfully Deleted Message");
            fetchMessages();
        }
        else {
            toast("Error Deleting Message");
        }
        
    }
    
    if (loading) return <Loader />;
    return (
        <>
            <div className="flex flex-col justify-center items-center w-screen h-80vh">
                <h1 className="text-5xl text-black font-extrabold text-center mt-16 mb-8">{chatroomData.chatroomName}</h1>
                <div className="w-9/12 xl:w-5/12 md:w-7/12">
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
                                    <div className='w-full flex flex-col justify-center items-center group mb-3'>
                                        {msg.username === user.username ? (
                                            <div className='flex items-center justify-center self-end'>
                                                <div className='flex items-center justify-center opacity-0 group-hover:opacity-100 mr-3'>
                                                    <FaPenToSquare className="mr-3 cursor-pointer text-slate-600 text-xl" />
                                                    <FaTrashAlt className="text-slate-600 text-xl cursor-pointer" onClick={()=>{setMessageToDelete(msg);setIsDialogOpen(true)}}/>
                                                </div>
                                                <div className="bg-blue-600 py-2 px-2 rounded-xl max-w-md break-words">
                                                    <strong className="text-gray-200">{"You"}</strong>
                                                    <br />
                                                    <p className="text-white">{msg.message}</p>
                                                    <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className='flex items-center justify-center self-start'>
                                                <div className="bg-blue-600 py-2 px-2 rounded-xl max-w-md break-words">
                                                    <strong className="text-gray-200">{msg.username}</strong>
                                                    <br />
                                                    <p className="text-white">{msg.message}</p>
                                                    <p className="text-right text-xs text-gray-200">{returnDisplayTime(msg.timestamp)}</p>
                                                </div>
                                                {(user.isAdmin) && (
                                                <div className='flex items-center justify-center opacity-0 group-hover:opacity-100 ml-3'>
                                                    <FaTrashAlt className="text-slate-600 text-xl cursor-pointer" onClick={()=>{setMessageToDelete(msg);setIsDialogOpen(true)}}/>
                                                </div>)}
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className="flex w-full">
                        <textarea
                            className="w-full h-12 px-3 rounded-bl-xl border-0 resize-none flex items-center pt-2"
                            rows={1}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
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

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                <div></div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{deleteMessage(messageToDelete)}}>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


export default Chatroom;