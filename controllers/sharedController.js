import crypto from "crypto";
import { prisma } from "../lib/prisma.js";
import supabase from "../lib/supabase.js";

export async function createShareLink(req, res) {
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: req.params.folderId,
        userId: req.user.id,
      },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found!" });
    }

    const existingShare = await prisma.sharedFolder.findFirst({
      where: {
        folderId: folder.id,
      },
    });

    if (existingShare) {
      return res.json({
        url: `${req.protocol}://${req.get("host")}/shared/${existingShare.token}`,
      });
    }

    const token = crypto.randomUUID();

    const expiresAt = new Date(Date.now() + 1000 * 60);

    const share = await prisma.sharedFolder.create({
      data: {
        token,
        folderId: folder.id,
        expiresAt,
      },
    });

    return res.json({
      url: `${req.protocol}://${req.get("host")}/shared/${token}`,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create share link",
    });
  }
}

async function buildSharedPath(folder) {
  if (!folder.path) {
    return [];
  }

  const pathIds = folder.path.split("/").filter(Boolean);

  return await prisma.folder.findMany({
    where: {
      id: {
        in: pathIds,
      },
    },

    orderBy: {
      createdAt: "asc",
    },

    select: {
      id: true,
      name: true,
    },
  });
}

export async function viewSharedRoot(req, res) {
  try {
    const share = await prisma.sharedFolder.findUnique({
      where: {
        token: req.params.token,
      },
      include: {
        folder: {
          include: {
            children: {
              orderBy: {
                updatedAt: "desc",
              },
            },
            files: {
              orderBy: {
                updatedAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!share) {
      return res.status(404).send("shared folder not found!");
    }
    if (share.expiresAt && share.expiresAt < new Date()) {
      return res.status(403).send("Share link expired");
    }
    const pathString = await buildSharedPath(share.folder);

    return res.render("sharedFolder", {
      currentFolder: share.folder,
      shareToken: share.token,
      pathString,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong!");
  }
}

export async function viewSharedFolder(req, res) {
  try {
    const share = await prisma.sharedFolder.findUnique({
      where: {
        token: req.params.token,
      },

      include: {
        folder: true,
      },
    });

    if (!share) {
      return res.status(404).send("Shared folder not found");
    }
    if (share.expiresAt && share.expiresAt < new Date()) {
      return res.status(403).send("Share link expired");
    }
    const folder = await prisma.folder.findUnique({
      where: {
        id: req.params.folderId,
      },

      include: {
        children: {
          orderBy: {
            updatedAt: "desc",
          },
        },

        files: {
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    if (!folder.path.startsWith(share.folder.path)) {
      return res.status(403).send("Access denied");
    }

    const pathString = await buildSharedPath(folder);

    return res.render("sharedFolder", {
      currentFolder: folder,

      shareToken: share.token,
      pathString,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).send("Something went wrong");
  }
}

export async function downloadSharedFile(req, res) {
  try {
    const share = await prisma.sharedFolder.findUnique({
      where: {
        token: req.params.token,
      },

      include: {
        folder: true,
      },
    });

    if (!share) {
      return res.status(404).send("Shared folder not found");
    }
    if (share.expiresAt && share.expiresAt < new Date()) {
      return res.status(403).send("Share link expired");
    } 
    const file = await prisma.file.findUnique({
      where: {
        id: req.params.fileId,
      },

      include: {
        folder: true,
      },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (!file.folder.path.startsWith(share.folder.path)) {
      return res.status(403).send("Acess denied");
    }

    const { data, error } = await supabase.storage
      .from("drive-files")
      .createSignedUrl(file.storagePath, 60, { download: file.name });

    if (error) {
      throw error;
    }

    return res.redirect(data.signedUrl);
  } catch (err) {
    console.error(err);

    return res.status(500).send("Download failed");
  }
}
