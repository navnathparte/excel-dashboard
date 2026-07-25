import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.join(process.cwd(), "uploads", "csv");

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

const uploadDir = path.join(process.cwd(), "uploads", "csv");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadCsv = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024 * 1024, // 1 GB
  },

  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }

    cb(null, true);
  },
});
