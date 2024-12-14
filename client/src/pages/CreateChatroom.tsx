import { useState } from "react"
import InputEntry from "../components/InputEntry"
import useAuth from "../store/Auth";
import LINK from "../store/Link";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateChatroom = () => {

    const [roomName, setRoomName] = useState("");
    const {user} = useAuth();
    const navigate = useNavigate();

    async function createFunction() {
        const resp:any = await fetch(LINK + "api/chatroom/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatroomName: roomName,
                creatorUserId: user.userId,
                creatorUsername: user.username
            })
        }); 
        toast(resp.message);

        navigate("/home");
    } 

  return (
    <div className="flex flex-col justify-center items-center w-full h-90vh text-center">
        <InputEntry changeFunction={(e)=>setRoomName(e.target.value)} name="chatroomName" text="Chatroom Name" placeholder="Enter Chatroom Name" value={roomName} /> 
        <button onClick={createFunction} className="customButton">Create</button>
    </div>
  )
}

export default CreateChatroom