import express from "express";
import * as chatControllers from "../controller/chat-controller.js";
import chatSchema from "../validators/chat-validator.js";
import validateChat from "../middlewares/chat-middleware.js";
const router = express.Router();

router.route("/add").post(validateChat(chatSchema),chatControllers.addChat);
router.route("/delete").patch(chatControllers.deleteChat);
router.route("/update").patch(chatControllers.updateChat);
router.route("/fetch").post(chatControllers.fetchChat);

export default router;