import { Router } from "express";
import { uploadFile } from "../controllers/fileController.js"
import multer from "multer";

const upload = multer({dest: 'uploads/'})

const fileRouter = Router();

fileRouter.post("/signed-upload", uploadFile);

export default fileRouter;