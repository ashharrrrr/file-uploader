import { Router } from "express";
import { uploadFile } from "../controllers/fileController.js"
import multer from "multer";

const upload = multer({dest: 'uploads/'})

const fileRouter = Router();

fileRouter.post("/upload", upload.single("uploaded_file"), uploadFile);

export default fileRouter;