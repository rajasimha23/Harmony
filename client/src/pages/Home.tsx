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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    },[])
    
    const {user}:{user:UserType} = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [chatrooms, setChatrooms] = useState([]);
    const [chatroomName, setChatroomName] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    
    type CardType = {
        chatroomUserId:number,
        chatroomName:string,
        createdAt:Date,
        creatorUsername:string
        chatroomId:number
    }

    type RespType = {
        message:string
    }

    function createChatroomCards(entry:CardType){
        return <ChatroomCard chatroomName={entry.chatroomName} createdAt={entry.createdAt} creatorUsername={entry.creatorUsername} 
        key={entry.chatroomId} chatroomId={entry.chatroomId}/>
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
          toast('Please select a file first!');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          const response = await fetch('http://localhost:5000/api/file/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (response.ok) {
            toast('File uploaded and data stored successfully!');
          } else {
            toast(`Error: ${result.message}`);
          }
        } catch (err) {
          console.error(err);
          toast('Something went wrong!');
        }
    };

    if (isLoading) return <><AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/><Loader /></>;

    return <div className="w-full min-h-screen">
        <AddHeader addTrigger={setIsDialogOpen} fileAddTrigger={setIsUploadDialogOpen}/>
        <>
            <div className="w-full min-h-80vh">
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
                    </DialogHeader>
                    <Input id="newName" onChange={(e)=>{setChatroomName(e.target.value)}} className="w-full" autoFocus placeholder="Enter Room Name"/>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={()=>{setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Cancel</Button>
                        <Button onClick={()=>{createChatroom(); setIsDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Create <MessageSquarePlus className="w-5 h-5 mr-2" /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Upload Excel Sheet</DialogTitle>
                    </DialogHeader>
                    <Input id="newFile" type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="w-full bg-blue-200 cursor-pointer" autoFocus/>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={()=>{setIsUploadDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Cancel</Button>
                        <Button onClick={()=>{handleUpload(); setIsUploadDialogOpen(false)}} className='bg-blue-600 hover:bg-blue-400 text-white font-universal mb-2'>Upload</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    </div>
}   

export default Home;

