import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import TOKENNAME from "../store/Token";
import LINK from "../store/Link";
import ChatroomCard from "../components/ChatroomCard";

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
    const userID:string = user._id;
    const [isLoading, setLoading] = useState(false);
    const [chatrooms, setChatrooms] = useState([]);

    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
    }

    function createChatroomCards(entry:CardType){
        return <ChatroomCard chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} key={entry.chatroomUserId}/>
    }

    // async function fetchChatrooms(){
    //     const response = await fetch(LINK + "api/chatroom/fetch", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //     }); 
    //     const resp = await response.json();
    //     const ArrayChatrooms:Array<any> = resp.chatrooms;
    //     console.log(typeof ArrayChatrooms)
    //     console.log(ArrayChatrooms);
    //     if (response.ok) setChatrooms(ArrayChatrooms);
    // }
    async function fetchChatrooms() {
        try {
            const response = await fetch(LINK + "api/chatroom/fetch", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to fetch chatrooms");
            }
    
            const resp = await response.json();
    
            if (!Array.isArray(resp.chatrooms)) {
                throw new Error("Invalid data format: chatrooms is not an array");
            }
    
            setChatrooms(resp.chatrooms);
            console.log("Fetched Chatrooms: ", resp.chatrooms);
        } catch (error) {
            console.error("Error fetching chatrooms:", error);
            setChatrooms([]); // Fallback to empty array
        }
    }
    

    React.useEffect(()=>{
        fetchChatrooms();
    },[])

    return <>
        {isLoading ?<Loader /> : 
            (<div className="mx-5">
                <div className="flex flex-col justify-center items-center w-full h-90vh">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center">Welcome, {user.username}</h1>
                    <div className="space-x-4 space-y-3">
                        {chatrooms.map(createChatroomCards)}
                    </div>
                </div>
            </div> )}
    </>
}   

export default Home;