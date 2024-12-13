import React from 'react'

type CardType = {
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string
}

const ChatroomCard = (props:CardType) => {
    const dateStr = props.createdAt;
    const unformattedDate = new Date(dateStr);
    const options:any = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = unformattedDate.toLocaleDateString('en-US', options);

    return (
        <button>
            <div className='bg-[#5c5c5c] rounded-xl py-6 px-4'>
                <h1 className='text-3xl text-purple-400 mb-5'>{props.chatroomName}</h1>
                <h2 className="text-xl text-blue-200 mb-2">Creator: {props.creatorUsername}</h2>
                <h2>{formattedDate}</h2>
            </div>
        </button>
    )
}

export default ChatroomCard