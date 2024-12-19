import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import LINK from "../store/Link";
import ChatroomCard from "../components/ChatroomCard";
import { UserType } from "../store/Auth";

function Home() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);
    
    const {user, setLastPage}:{user:UserType, setLastPage:(x:string)=>void} = useAuth();
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
        key={entry.chatroomId} chatroomId={entry.chatroomId} />
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
    
            if (!response.ok) {
                throw new Error("Failed to fetch chatrooms");
            }
    
            const resp = await response.json();
    
            if (!Array.isArray(resp.chatrooms)) {
                throw new Error("Invalid data format: chatrooms is not an array");
            }
    
            setChatrooms(resp.chatrooms);
        } catch (error) {
            setChatrooms([]); 
        }   finally {
            setLoading(false);
        }

    }
    useEffect(()=>{
        fetchChatrooms();
        setLastPage("/home");
    },[])

    if (isLoading) return <Loader />;

    return <div className="w-full">
        <div className="mx-5 h-80vh">
            <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-16">Welcome {user.username}!</h1>
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-10">Chatrooms</h1>
                <div className="flex flex-row justify-center items-center flex-wrap">
                    {chatrooms.map(createChatroomCards)}
                </div>
            </div>
        </div>
    </div>
}   

export default Home;

