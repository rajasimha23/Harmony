import express from "express";
import http from "http";
import { Server} from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import router from "./router/auth-router.js";
import {connectDB} from "./utils/db.js"
import errorMiddleware from "./middlewares/error-middleware.js";
import chatroomRouter from "./router/chatroom-router.js"


const PORT= 5000; 
const app = express();

app.use(cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
    exposedHeaders: "*",
    credentials: true,
}));
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/chatroom", chatroomRouter);
app.use(errorMiddleware);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: "*", 
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinChatroom", (chatroomName) => {
        socket.join(chatroomName);
        console.log(`${socket.id} joined chatroom: ${chatroomName}`);
    });

    socket.on("sendMessage", ({ chatroomName, message}) => {
        console.log("Message: ", message, "\tChatroom: ",chatroomName);
        io.to(chatroomName).emit("receiveMessage", { message });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

connectDB().then( () => {
    server.listen(PORT, ()=> {
        console.log(`Server is running at Port ${PORT}`);
    })
});