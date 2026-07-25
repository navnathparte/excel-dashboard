import { AppDataSource } from "../config/database";
import { UploadHistory, UploadStatus } from "../entities/UploadHistory";

const repository = AppDataSource.getRepository(UploadHistory);

export class UploadService {
  async createUpload(file: Express.Multer.File) {
    const upload = repository.create({
      fileName: file.filename,
      originalName: file.originalname,
      status: UploadStatus.PENDING,
    });

    return repository.save(upload);
  }
}
