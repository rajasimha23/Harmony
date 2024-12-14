import { FaTrashAlt } from "react-icons/fa";
import { useState } from "react";

type CardType = {
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string,
    chatroomId:number,
    key:number,
    // deleteFunction:any
    deleteHandler: () => void
    setChatroomMethod: any
}

const ChatroomCard = (props:CardType) => {
    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options:any = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = unformattedDate.toLocaleDateString('en-US', options);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    async function initialDelete() {
        console.log("Reached Here");
        setDeleteConfirmation(true);
    }


    return (
        <button>
            <div className="bg-[#5c5c5c] rounded-xl py-6 px-4 group text-center">
                {deleteConfirmation?(
                    <>
                        <h1 className='text-3xl text-red-400 mb-5'>Confirm Delete?</h1>
                        <h2 className="text-xl text-red-200 mb-2"  onClick={()=>{setDeleteConfirmation(false);props.deleteHandler()}}>Yes</h2>
                        <h2 className="text-xl text-red-200 mb-2 " onClick={()=>{setDeleteConfirmation(false)}}>Cancel</h2>
                    </>
                    ):(
                    <>
                        <h1 className='text-3xl text-purple-400 mb-5'>{props.chatroomName}</h1>
                        <h2 className="text-xl text-blue-200 mb-2">Creator: {props.creatorUsername}</h2>
                        <h2>{formattedDate}</h2>
                        <div className="flex justify-center items-center mt-3">
                            <FaTrashAlt
                                className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                onClick={() => {props.setChatroomMethod(props.chatroomId); props.deleteHandler()}}
                            />
                        </div>
                    </>
                )}
            </div>
        </button>
    )
}

export default ChatroomCard

