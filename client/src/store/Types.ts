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