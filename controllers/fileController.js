import { prisma } from "../lib/prisma.js";
import crypto from "crypto";
import supabase from "../lib/supabase.js";
import path from "path";
import { error } from "console";
console.log("UPLOAD FILE HIT")

export async function uploadFile(req, res, next) {
  try {
    console.log("server listening")
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
    console.log(size)
    if (size > 10 * 1024 * 1024) {
        return res.status(400).json({
            error: "Max file size is 10MB"
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

export async function downloadFile(req, res, next) {
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: req.params.fileId,
        userId: req.user.id,
      },
    });

    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
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

    return res.status(500).json({
      error: "Download Failed!",
    });
  }
}

export async function deleteFile(req, res, next){
    try {
       const file = await prisma.file.findFirst({
        where: {
            id: req.params.fileId,
            userId: req.user.id,
        },
       }) 

       if (!file) {
        req.flash("error", "File not found!")
        return res.redirect(
            req.get("Referrer") || "/"
        );
       }

       const { error } = await supabase.storage.from("drive-files").remove([file.storagePath]);

       if (error) {
        throw error;
       }

       await prisma.file.delete({
        where: {
            id: file.id,
        },
       });

       req.flash(
        "success",
        "File deleted"
       );

       return res.redirect(
        req.get("Referrer") || "/"
       );

    } catch (err) {
        console.error(err);

        req.flash("error", "Delete failed!");
        return res.redirect("back");
    }
}