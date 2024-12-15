import { FaTrashAlt } from "react-icons/fa";
import useAuth from "../store/Auth";
import { useNavigate } from "react-router-dom";

type CardType = {
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string,
    chatroomId:number,
    deleteHandler: () => void
    setChatroomMethod: (x:number)=>void
}

const ChatroomRow = (props:CardType) => {
    const navigate = useNavigate();
    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = unformattedDate.toLocaleDateString('en-US', options);
    const {user} = useAuth();


    return (
        <>
            <div className=" py-6 px-4 group flex flex-row items-center">
                <div className="mr-3">
                    { (!user.isAdmin) ? (null) : (<div className="flex justify-center items-center">
                        <FaTrashAlt
                            className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            onClick={() => {props.setChatroomMethod(props.chatroomId); props.deleteHandler()}}
                        />
                    </div>)}
                </div>
                <h1 className='text-2xl text-white w-6/12 text-left cursor-pointer' onClick={()=>{navigate(`/chatroom/${props.chatroomId}`)}}>{props.chatroomName}</h1>
                <h2 className="text-2xl text-white w-3/12 text-left">{props.creatorUsername}</h2>
                <h2 className="text-2xl text-white w-3/12 text-left">{formattedDate}</h2>
            </div>
        </>
    )
}

export default ChatroomRow;

