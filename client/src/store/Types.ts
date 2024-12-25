export type ChatroomType = {
    _id: string;
    chatroomName: string;
    creatorUserId: number;
    creatorUsername: string;
    createdAt: Date;
    chatroomId: number;
};

export type MessageType = {
    userId: number;
    username: string;
    message: string;
    timestamp: Date;
};

export type CardType = {
    chatroomUserId:number,
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string
    chatroomId:number
}

export type RespType = {
    message:string
}