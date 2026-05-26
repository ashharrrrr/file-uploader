console.log("UPLOAD CONTROLLER HIT");
import { prisma } from "../lib/prisma.js";
import crypto from "crypto";
import supabase from "../lib/supabase.js";
import path from "path";

export async function uploadFile(req, res, next) {
  try {
    const { fileName, mimeType, size, folderId } = req.body;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "text/plain",
    ];

    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({
        error: "Invalid file type",
      });
    }

    if (size > 10 * 1024 * 1024) {
      return res.status(400).json({
        error: "File too large",
      });
    }

    const extension = fileName.split(".").pop();

    const fileKey = crypto.randomUUID();

    const storagePath = `${req.user.id}/${fileKey}.${extension}`;

    const { data, error } = await supabase.storage
      .from("drive-files")
      .createSignedUploadUrl(storagePath);

    if (error) {
      throw error;
    }

    console.log("Creating prisma file...");

    await prisma.file.create({
      data: {
        name: fileName,

        fileKey,

        storagePath,

        mimeType,

        size,

        userId: req.user.id,

        folderId,
      },
    });

    console.log("Prisma file created.");

    return res.json({
      token: data.token,
      path: storagePath,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}


