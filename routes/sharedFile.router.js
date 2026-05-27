import { Router } from "express";
import { viewSharedRoot, viewSharedFolder, downloadSharedFile } from "../controllers/sharedController.js"

const sharedRouter = Router()

sharedRouter.get("/:token", viewSharedRoot);
sharedRouter.get("/:token/folder/:folderId", viewSharedFolder);
sharedRouter.get("/:token/download/:fileId", downloadSharedFile);

export default sharedRouter;

