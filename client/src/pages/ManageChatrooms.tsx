import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import LINK from "../store/Link";
import {toast} from "react-toastify";
import ChatroomRow from "../components/ChatroomRow";
import { FaTrashAlt } from "react-icons/fa";
import { UserType } from "../store/Auth";
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


function ManageChatrooms() {
    const navigate = useNavigate();
    const {user, setLastPage,isLoggedIn}:{user:UserType, setLastPage:(x:string)=>void, isLoggedIn:boolean} = useAuth();
    
    useEffect(() => {
        console.log(isLoggedIn);
        console.log(user);
        if (!isLoggedIn) {
            navigate("/login"); 
        } 
        else if (isLoggedIn && !user.isAdmin) {
            navigate("/home");
        }
    }, [isLoggedIn]);

    
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);
    const [selectedChatroomId, setChatroomId] = useState(0);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
        chatroomId:number
    }

    function createChatroomRows(entry:CardType){
        return <ChatroomRow chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomId} chatroomId={entry.chatroomId} 
        setChatroomMethod={setChatroomId} deleteHandler={setIsAlertDialogOpen}/>
    }


    async function deleteChatroom() {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/chatroom/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatroomId:selectedChatroomId,
                    userId: user.userId
                })
            });
            if (response.ok) {
                const response2 = await fetch(LINK + "api/chat/deleteChatroomChats", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        chatroomId:selectedChatroomId,
                        userId: user.userId
                    })
                })
                fetchChatrooms();

                if (!response2.ok) {
                    const rest2_data = await response2.json();
                    toast(rest2_data.message);
                }
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
        } catch (error) {
            setChatrooms([]); 
        }   finally {
            setLoading(false);
        }

    }
    useEffect(()=>{
        fetchChatrooms();
        setLastPage("/manage");
    },[])

    if (isLoading) return <Loader />;

    return <>
        <div className="w-full min-h-80vh">
            <div className="flex flex-col justify-start items-center mx-5 mb-12">
                <h1 className="text-4xl md:text-5xl text-center font-extrabold mt-20 mb-10">Manage Chatrooms</h1> 
                
                <div className="bg-credbg flex flex-col md:w-7/12 rounded-2xl overflow-hidden shadow-3xl">
                    <div className="bg-[#cfcfcf] py-6 px-4 group flex flex-row items-center">
                        <FaTrashAlt className=" text-xl opacity-0 group-hover:opacity-0 transition-opacity duration-500 mr-3"/>
                        <h1 className='text-2xl w-6/12 text-left text-black'>Chatroom</h1>
                        <h2 className="text-2xl w-3/12 text-left text-black">Creator</h2>
                        <h2 className="text-2xl w-3/12 text-left text-black">Created</h2>
                    </div>
                    {chatrooms.map(createChatroomRows)}
                </div>

            </div>
        </div>

        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogTrigger asChild>
            <div></div>
            </AlertDialogTrigger>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="font-universal">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="font-universal">
                This action cannot be undone. This will permanently delete this Chatroom from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)} className="font-universal hover:bg-blue-400 text-white hover:text-white bg-blue-600" >Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{setIsAlertDialogOpen(false);deleteChatroom()}} className="font-universal hover:bg-blue-400 text-white bg-blue-600" >Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
    </>
}   

export default ManageChatrooms;