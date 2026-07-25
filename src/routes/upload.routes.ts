import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { uploadExcel } from "../config/multer";

const router = Router();
const controller = new UploadController();

router.post("/", uploadExcel.single("file"), controller.upload);

export default router;
