import { prisma } from "../lib/prisma.js";

export async function uploadFile(req, res, next) {
  try {
    const userId = req.user.id;
    const folderId = req.body.folderId;

    const file = req.file;

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
    });

    if (!folder) {
      req.flash("error", "Folder Not Found");
      return res.redirect(`/folders/${folderId}`);
    }

    await prisma.file.create({
      data: {
        name: file.originalname,
        fileKey: file.filename,
        size: file.size,
        mimeType: file.mimeType,
        userId,
        folderId,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Upload Failed!");
    res.redirect(`/folders/${req.body.folderId}`);
  }
};
