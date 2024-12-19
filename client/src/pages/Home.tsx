import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";
import LINK from "../store/Link";
import ChatroomCard from "../components/ChatroomCard";
import { UserType } from "../store/Auth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { toast } from "react-toastify";
import AddHeader from "@/components/headers/AddHeader";
import { MessageSquarePlus } from "lucide-react";


function Home() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn]);

    useEffect(()=>{
        fetchChatrooms();
        setLastPage("/home");
    },[])
    
    const {user, setLastPage}:{user:UserType, setLastPage:(x:string)=>void} = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);
    const [chatroomName, setChatroomName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
        chatroomId:number
    }

    interface RespType{
        message:string
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

    async function createChatroom() {
        const resp = await fetch(LINK + "api/chatroom/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatroomName: chatroomName,
                creatorUserId: user.userId,
                creatorUsername: user.username
            })
        }); 
        const responseData:RespType = await resp.json();
        toast(responseData.message);
        fetchChatrooms();
    } 


    if (isLoading) return <Loader />;

    return <>
        <AddHeader addTrigger={setIsDialogOpen}/>
        <>
            <div className="w-full h-80vh">
                <div className="mx-5">
                    <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-16">Welcome {user.username}!</h1>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1 className="mb-5 text-4xl md:text-5xl text-center font-extrabold text-gray-800 mt-10">Chatrooms</h1>
                        <div className="flex flex-row justify-center items-center flex-wrap">
                            {chatrooms.map(createChatroomCards)}
                        </div>
                    </div>
                </div>
            </div>

            

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                    <DialogTitle>Start a New Chatroom</DialogTitle>
                    <DialogDescription>
                        {/* Make changes to your Message here. Click save when you're done. */}
                    </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        </div>
                    </div> */}
                    <Input id="newName" onChange={(e)=>{setChatroomName(e.target.value)}} className="col-span-3" autoFocus placeholder="Enter Room Name"/>
                    <DialogFooter>
                    <Button onClick={()=>{setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal'>Cancel</Button>
                    <Button onClick={()=>{createChatroom(); setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal'>Create Chatroom <MessageSquarePlus className="w-5 h-5 mr-2" /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    </>
}   

export default Home;

