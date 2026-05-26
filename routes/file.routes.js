import { Router } from "express";
import { uploadFile, downloadFile, deleteFile } from "../controllers/fileController.js"
console.log("FILE ROUTER LOADED")
const fileRouter = Router();

fileRouter.post("/signed-upload", uploadFile);
fileRouter.get("/download/:fileId", downloadFile);
fileRouter.post("/delete/:fileId", deleteFile);

export default fileRouter;