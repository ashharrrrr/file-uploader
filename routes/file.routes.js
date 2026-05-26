import { Router } from "express";
import { uploadFile, downloadFile } from "../controllers/fileController.js"
import multer from "multer";

const upload = multer({dest: 'uploads/'})

const fileRouter = Router();

fileRouter.post("/signed-upload", uploadFile);
fileRouter.get("/download/:fileId", downloadFile);

export default fileRouter;