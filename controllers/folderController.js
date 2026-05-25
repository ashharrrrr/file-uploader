import { prisma } from "../lib/prisma";

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
        return res.status(409).render("index", {
          errors: [{ msg: "Parent folder not found." }],
          old: req.body,
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
        return res.status(409).render("index", {
          errors: [{ msg: "Folder with this name already exists!" }],
          old: req.body,
        });
      }
      console.error(err);
      return res.status(500).render("index", {
        errors: [{ msg: "Failed to create folder." }],
        old: req.body,
      });
    }
  },
];

export async function getFolder(req, res, next) {
    try{
        const userId = req.user.id;

        const folderId = req.params.folderId;

        const currentFolder = await prisma.folder.findFirst({
            where: {
                id: folderId,
                userId
            }
        })

        if (!currentFolder) {
            return res.status(404).render("index", {
                errors: [{ msg: "Folder not found!" }],
                old: req.body
            })
        }

        const folders = await prisma.folder.findMany({
            where: {
                parentId: folderId,
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const files = await prisma.file.findMany({
            where:{
                folderId,
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const pathStringIds = currentFolder.path.split("/");

        const pathStringFolders = await prisma.folder.findMany({
            where: {
                id: {
                    in: pathStringIds
                }
            }
        });

        const pathString = pathStringIds.map(id => pathStringFolders.find(folder => folder.id === id));

        res.render("folder", {
            currentFolder,
            folders,
            files,
            pathString
        })

    } catch (err) {
        console.error(err);
        res.status(500).render("index", {
            errors: [{ msg: "Failed to load folder." }],
            old: req.body
        })
    }
}