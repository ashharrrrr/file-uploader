import { prisma } from "../lib/prisma.js";

export async function getFolderData(folderId, userId) {
  const currentFolder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId,
    },
  });

  if (!currentFolder) {
    throw new Error("Folder Not Found!")
  }

  const folders = await prisma.folder.findMany({
    where: {
      parentId: folderId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const files = await prisma.file.findMany({
    where: {
      folderId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pathStringIds = currentFolder.path.split("/").filter(Boolean);

  const pathStringFolders = await prisma.folder.findMany({
    where: {
      id: {
        in: pathStringIds,
      },
    },
  });

  const pathMap = {};
  pathStringFolders.forEach((folder) => {
    pathMap[folder.id] = folder;
  });

  const pathString = pathStringIds.map((id) => pathMap[id]);

  const entries = [
    ...folders.map((folder) => ({
      type: "folder",
      ...folder,
    })),

    ...files.map((file) => ({
      type: "file",
      ...file,
    })),
  ];

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return {
    currentFolder,
    folders,
    files,
    pathString,
    entries: sortedEntries,
  };
}
