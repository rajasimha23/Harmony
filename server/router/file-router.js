import express from "express";
import * as fileControllers from "../controller/file-controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.route("/upload").post(upload.single('file'), fileControllers.uploadFile);

export default router;