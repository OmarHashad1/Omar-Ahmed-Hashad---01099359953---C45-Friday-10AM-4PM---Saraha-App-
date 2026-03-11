import multer, { diskStorage } from "multer";
import fs from "fs/promises";
import { resolve } from "path";

export const fileTypes = {
  image: ["image/jpg", "image/jpeg", "image/png", "image/apng"],
};
export const upload = ({
  dest = "general",
  mimetype = fileTypes.image,
  size= "10"
} = {}) => {
  const storage = diskStorage({
    destination: async (req, file, cb) => {
      const relativePath = `./uploads/${dest}`;
      const folderPath = resolve(relativePath);
      try {
        await fs.access(folderPath, fs.constants.F_OK);
      } catch {
        await fs.mkdir(folderPath, { recursive: true });
      } finally {
        file.relativePath = relativePath;
        cb(null, folderPath);
      }
    },
    filename: (req, file, cb) => {
      try {
        const imageUniqueName = `${Date.now()}-${file.originalname}`;
        file.relativePath += `/${imageUniqueName}`;
        cb(null, imageUniqueName);
      } catch (err) {
        cb(err, null);
      }
    },
  });

  const fileFilter = (req, file, cb) => {
   
    if (mimetype.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error("Invalid file format", {
          cause: { status: 400 },
        }),
        null,
      );
  };
  return multer({
    storage,
    fileFilter,
    limits: {
      size: 1 * 1024,
    },
  });
};
