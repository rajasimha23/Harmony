import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import TOKENNAME from "../store/Token";
import LINK from "../store/Link";
import ChatroomCard from "../components/ChatroomCard";
import {toast} from "react-toastify";

function Home() {
    const navigate = useNavigate();
    const currToken = localStorage.getItem(TOKENNAME);

    React.useEffect(() => {
        if (!currToken) {
            navigate("/login"); 
        }
    }, [currToken]);

    // type UserType = {
    //     email:string,
    //     isAdmin:boolean,
    //     joinedOn:Date,
    //     userId:number,
    //     username:string,
    //     _id:string
    // }

    const {user}:any = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);

    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
        chatroomId:number
    }

    function createChatroomCards(entry:CardType){
        return <ChatroomCard chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomUserId} chatroomId={entry.chatroomId} 
        deleteHandler={deleteChatroom} />
    }

    async function deleteChatroom(chatroomId:number) {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatroomId:chatroomId,
                    userId: user.userId
                })
            });
            if (response.ok) {
                toast("Successfully Deleted Chatroom");
                fetchChatrooms();
            }
            else {
                const res_data = await response.json();
                toast(res_data.message);
            }
        }
        catch {

        }
        finally {
            setLoading(false);
        }
    }

    async function fetchChatrooms() {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/fetch", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setLoading(false);
    
            if (!response.ok) {
                throw new Error("Failed to fetch chatrooms");
            }
    
            const resp = await response.json();
    
            if (!Array.isArray(resp.chatrooms)) {
                throw new Error("Invalid data format: chatrooms is not an array");
            }
    
            setChatrooms(resp.chatrooms);
            //console.log("Fetched Chatrooms: ", resp.chatrooms);
        } catch (error) {
            //console.error("Error fetching chatrooms:", error);
            setChatrooms([]); // Fallback to empty array
        }   finally {
            setLoading(false);
        }

    }
    useEffect(()=>{
        fetchChatrooms();
    },[])

    return <>
        {isLoading ? <Loader /> : 
            <div className="mx-5">
                <div className="flex flex-col justify-center items-center w-full h-90vh">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center">Welcome, {user.username}</h1>
                    <div className="space-x-4 space-y-4">
                        {chatrooms.map(createChatroomCards)}
                    </div>
                    {(!user.isAdmin)?(null):(
                        <button className="customButton mt-5" onClick={()=>{navigate("/createChatroom")}}>Add Chatroom</button>
                    )}
                </div>
            </div>
        }
    </>
}   

export default Home;