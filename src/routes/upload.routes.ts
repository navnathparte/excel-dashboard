import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { uploadCsv } from "../config/multer";

const router = Router();
const controller = new UploadController();

router.post("/csv", uploadCsv.single("file"), controller.upload);

export default router;
