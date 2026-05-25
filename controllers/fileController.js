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
      return res.status(404).render("index", {
        errors: [{ msg: "Folder Not Found" }],
        old: req.body,
      });
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
    res.status(500).render("index", {
        error: [{ msg: "Upload Failed!" }],
        old: req.body
    })
  }
};
