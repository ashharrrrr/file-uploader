import { prisma } from "../lib/prisma.js";
import { getFolderData } from "../services/folder.service.js";

export const createFolder = [
  async (req, res) => {
    try {
      const userId = req.user.id;


      const { name, parentId } = req.body;

      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: parentId,
          userId,
        },
      });


      if (!parentFolder) {
        req.flash("error", "Parent folder not found.");
        return res.redirect(`/folders/${parentId}`);
      }

      let folder = await prisma.folder.create({
        data: {
          name,
          userId,
          parentId,
          path: "temp",
        },
      });

      folder = await prisma.folder.update({
        where: {
          id: folder.id,
        },
        data: {
          path: `${parentFolder.path}/${folder.id}`,
        },
      });

      res.redirect(`/folders/${parentId}`);
    } catch (err) {
      if (err.code === "P2002") {
        req.flash("error", "Folder with this name already exists!");
        return res.redirect(`/folders/${req.body.parentId}`);
      }
      console.error("PRISMA ERROR", err);
      req.flash("error", "Failed to create folder.");
      return res.redirect(`/folders/${req.body.parentId}`);
    }
  },
];

export async function getFolder(req, res, next) {
  try {

    const userId = req.user.id;

    const folderId = req.params.folderId;


    const data = await getFolderData(folderId, userId);

    res.render("index", {
      ...data,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load folder.");
    res.redirect(`/folders/${req.params.folderId}`);
  }
}

/*export async function renameFolder(req, res, next) {
  try {
    const { name, folderId } = req.body;

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: req.user.id,
      },
    });

    if (!folder) {
      req.flash("error", "Folder you're trying to rename does not exist!");
      return res.redirect(`/folders/${folderId}`);
    }

    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    if (err.code === "P2002") {
      req.flash("error", "Folder by this name already exists!");
      return res.redirect(`/folders/${req.body.folderId}`);
    }
    console.error(err);
    req.flash("error", "Server Error");
    return res.redirect(`/folders/${req.body.folderId}`);
  }
}*/
