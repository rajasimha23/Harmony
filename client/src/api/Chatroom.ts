import LINK from "@/store/Link";

export async function deleteMessage (data: {timestamp:Date, userId: number}) {
    return await fetch(LINK + "api/chat/delete", {
        method:"PATCH",
        headers:{
            "Content-type":"Application/JSON"
        },
        body: JSON.stringify(data)
    });    
}

export async function editMessage (data: {timestamp: Date, userId: number, newMessage: string}) {
    return await fetch(LINK + "api/chat/update", {
        method:"PATCH",
        headers:{
            "Content-type":"Application/JSON"
        },
        body: JSON.stringify(data)
    });
}

export const fetchMessages = async (chatroomId: number) => {
    return await fetch(LINK + `api/chat/fetch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
        }),
    });
};

export const fetchChatroom = async (chatroomId: number) => {
    return await fetch(LINK + `api/chatroom/getChatroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
        }),
    });
}
