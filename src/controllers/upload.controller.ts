import { UploadService } from "../services/upload.service";

const service = new UploadService();

export class UploadController {
  upload = async (req: any, res: any) => {
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
  };

  process = async (req: any, res: any) => {
    try {
      const uploadId = Number(req.params.uploadId);

      await service.processCsv(uploadId);

      return res.status(200).json({
        success: true,
        message: "CSV processing started",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getUploadStatus = async (req: any, res: any) => {
    try {
      const uploadId = Number(req.params.uploadId);

      const upload = await service.getUploadStatus(uploadId);

      return res.status(200).json({
        success: true,
        data: upload,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getUploads = async (req: any, res: any) => {
    try {
      const uploads = await service.getUploads();

      return res.status(200).json({
        success: true,
        data: uploads,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
