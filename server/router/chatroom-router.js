import express from "express";
import chatroomSchema from "../validators/chatroom-validator.js";
import validateChatroom from "../middlewares/chatroom-middleware.js";
import * as chatroomControllers from "../controller/chatroom-controller.js";

const router = express.Router(); 
router.route("/add").post(validateChatroom(chatroomSchema), chatroomControllers.addChatroom);
router.route("/remove").delete(chatroomControllers.removeChatroom);

export default router;