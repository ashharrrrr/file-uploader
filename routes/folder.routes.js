import { Router } from "express";
import { getFolder, createFolder, renameFolder, renameGet, deleteFolder } from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/rename/:folderId", renameGet);
folderRouter.post("/rename/", renameFolder); 

folderRouter.get("/:folderId", getFolder);
folderRouter.post("/",  createFolder);

folderRouter.post("/delete/:folderId", deleteFolder);


export default folderRouter;