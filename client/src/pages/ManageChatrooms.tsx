import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import LINK from "../store/Link";
import {toast} from "react-toastify";
import ChatroomRow from "../components/ChatroomRow";
import { FaTrashAlt } from "react-icons/fa";
import { UserType } from "../store/Auth";

function ManageChatrooms() {
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
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [selectedChatroomId, setChatroomId] = useState(0);
    useEffect(() => {
        if (!user.isAdmin) {
            navigate("/home");
        }
    }, []);

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
        deleteHandler={deleteChatroom} setChatroomMethod={setChatroomId}/>
    }


    async function confirmDeleteChatroom() {
        try {
            setDeleteConfirmation(false);
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

    async function deleteChatroom() {
        setDeleteConfirmation(true)
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
        {deleteConfirmation? 
            (<div className="mx-5"><div className="flex flex-col justify-center items-center w-full h-90vh">
                <h1 className="text-5xl text-center">Do You Really Want to Delete this Chatroom?</h1><br />
                <div>
                    <button className="w-32 h-12 mx-2 px-6 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-400" onClick={()=>{setDeleteConfirmation(false)}}><h6 className="text-xl">Cancel</h6></button>
                    <button className="w-32 h-12 mx-2 px-6 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-400" onClick={confirmDeleteChatroom}><h6 className="text-xl">Yes</h6></button>
                </div>
            </div></div>): (
            <div className="mx-5">
                <div className="flex flex-col justify-start items-center w-full h-90vh">
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
            </div>)
        }
    </>
}   

export default ManageChatrooms;