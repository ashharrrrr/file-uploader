import { prisma } from "../lib/prisma.js";
import { getFolderData } from "../services/folder.service.js";

export const createFolder = [
  async (req, res) => {
    try {
      const userId = req.user.id;

      console.log("createFOlder", req.body);

      const { name, parentId } = req.body;

      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: parentId,
          userId,
        },
      });

      console.log("PARENT FOLDER", parentFolder)

      if (!parentFolder) {
        console.log("THIS IS EXECUTING!!")
        return res.status(409).render("index", {
          errors: [{ msg: "Parent folder not found." }],
          old: req.body,
          user: req.user,
        });
      }

      let folder = await prisma.folder.create({
        data: {
          name,
          userId,
          parentId,
          path: "temp",
        },
      });

      console.log("FOLDER", folder)
      folder = await prisma.folder.update({
        where: {
          id: folder.id,
        },
        data: {
          path: `${parentFolder.path}/${folder.id}`,
        },
      });

      console.log("PARENT ID", parentId);
      res.redirect(`/folders/${parentId}`);
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).render("index", {
          errors: [{ msg: "Folder with this name already exists!" }],
          old: req.body,
        });
      }
      console.error("PRISMA ERROR", err);
      return res.status(500).render("index", {
        errors: [{ msg: "Failed to create folder." }],
        old: req.body,
      });
    }
  },
];

export async function getFolder(req, res, next) {
  try {

    console.log("SETP 1")

    const userId = req.user.id;

    const folderId = req.params.folderId;

    console.log("SETP 2", folderId)

    const data = await getFolderData(folderId, userId);

    console.log("STEP 3", data)

    res.render("index", {
        ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("index", {
      errors: [{ msg: "Failed to load folder." }],
      old: req.body,
    });
  }
}
