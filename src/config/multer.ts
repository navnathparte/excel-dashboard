import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads", "excel");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");

    cb(null, fileName);
  },
});

export const uploadExcel = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB
  },

  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (ext !== ".xlsx") {
      return cb(new Error("Only .xlsx files are allowed"));
    }

    cb(null, true);
  },
});
