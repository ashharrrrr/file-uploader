import { Router } from "express";
import { getFolder, createFolder } from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/:folderId", getFolder);
folderRouter.post("/",  createFolder);

//folderRouter.post("/rename/:folderId", renameFolder); 

export default folderRouter;