import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { uploadCsv } from "../config/multer";

const router = Router();
const controller = new UploadController();

router.post("/csv", uploadCsv.single("file"), controller.upload);
router.post(
  "/:uploadId/process",
  //   authenticate,
  controller.process,
);

// Get upload status
router.get(
  "/:uploadId",
  //   authenticate,
  controller.getUploadStatus,
);

// Get upload history
router.get(
  "/",
  //   authenticate,
  controller.getUploads,
);

export default router;
