import { useEffect, useState } from "react"
import useAuth from "../store/Auth";
import LINK from "../store/Link";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";

const CreateChatroom = () => {

    const [roomName, setRoomName] = useState("");
    const {user, lastPage} = useAuth();
    
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);

    interface RespType{
        message:string
    }

    async function createFunction() {
        const resp = await fetch(LINK + "api/chatroom/add", {
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
        const responseData:RespType = await resp.json();
        toast(responseData.message);

        navigate(lastPage);
    } 

//   return (
//     <div className="w-full min-h-80vh text-center">
//         <div className="flex flex-col justify-center items-center mb-20">
//             <div className="bg-credbg rounded-3xl overflow-hidden shadow-3xl px-16 py-12">
//                 <h1 className="text-left text-3xl mb-3 font-bold">Start a New Chatroom</h1>
//                 <input type="text" className="px-3 py-1 rounded-lg w-full h-10 text-center bg-inputColour text-black placeholder-black mb-3"
//                     name="chatroomName" placeholder="Enter Room Name" value={roomName} autoComplete="on" required onChange={(e)=>setRoomName(e.target.value)}/>
//                 <br />
//                 <button onClick={createFunction} disabled={!roomName.trim()}
//                         className="w-full bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center cursor-pointer">
//                         <MessageSquarePlus className="w-5 h-5 mr-2" />
//                         Create Chatroom
//                 </button>
//             </div>
//         </div>
//     </div>
//   )
    return (
        <div className="w-full min-h-screen text-center flex flex-col items-center justify-center mb-20">
            <div className="bg-credbg rounded-3xl overflow-hidden shadow-3xl px-16 py-12">
                <h1 className="text-left text-3xl mb-3 font-bold">Start a New Chatroom</h1>
                <input 
                    type="text" 
                    className="px-3 py-1 rounded-lg w-full h-10 text-center bg-inputColour text-black placeholder-black mb-3"
                    name="chatroomName" 
                    placeholder="Enter Room Name" 
                    value={roomName} 
                    autoComplete="on" 
                    required 
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <br />
                <button 
                    onClick={createFunction} 
                    disabled={!roomName.trim()}
                    className="w-full bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold hover:bg-blue-400 transition-colors duration-200 flex items-center justify-center cursor-pointer"
                >
                    <MessageSquarePlus className="w-5 h-5 mr-2" />
                    Create Chatroom
                </button>
            </div>
        </div>
    );
}

export default CreateChatroom

