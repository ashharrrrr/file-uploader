import { Router } from "express";
import { getFolder, createFolder, renameFolder, renameGet, deleteFolder } from "../controllers/folderController.js";
import { validateFolder } from "../services/validators.service.js";

const folderRouter = Router();

folderRouter.get("/rename/:folderId", renameGet);
folderRouter.post("/rename/", validateFolder, renameFolder); 

folderRouter.get("/:folderId", getFolder);
folderRouter.post("/", validateFolder, createFolder);

folderRouter.post("/delete/:folderId", deleteFolder);


export default folderRouter;