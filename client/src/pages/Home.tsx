import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import TOKENNAME from "../store/Token";
import LINK from "../store/Link";

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
    // console.log(user);
    const userID:string = user._id;
    const [isLoading, setLoading] = useState(false);
    const [chatrooms, setChatrooms] = useState(fetchChatrooms);

    async function fetchChatrooms(){
        const response = await fetch(LINK + "api/chatroom/fetch", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }); 
        const resp = await response.json();
        setChatrooms(resp.chatrooms);
        // console.log("Response: ",response);
        // console.log("Resp = ", resp)
        // setChatrooms(response.chatrooms);
        // console.log("Chatrooms \n",resp.chatrooms);
    }

    React.useEffect(()=>{
        fetchChatrooms();
    },[])

    return <>
        {isLoading ?<Loader /> : 
            (<div className="mx-5"><div className="flex flex-col justify-center items-center w-full h-90vh">
                <h1 className="mb-5 text-4xl md:text-5xl text-center">Welcome, {user.username}</h1>
            </div></div> )}
    </>
}   

export default Home;