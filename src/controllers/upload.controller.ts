import { UploadService } from "../services/upload.service";

const service = new UploadService();

export class UploadController {
  async upload(req: any, res: any) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File is required",
        });
      }

      // const upload = await service.createUpload(req.file!, req.user.id);
      const upload = await service.createUpload(req.file!, 1);

      return res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        data: upload,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
