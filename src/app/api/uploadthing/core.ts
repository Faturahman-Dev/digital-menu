import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Kita mendefinisikan "imageUploader" yang hanya menerima gambar max 4MB
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload selesai! URL file:", file.url);
    return { uploadedBy: "MenuSaaS User" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
