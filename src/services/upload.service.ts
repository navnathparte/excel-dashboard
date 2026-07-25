import { randomUUID } from "crypto";
import { AppDataSource } from "../config/database";
import { UploadHistory, UploadStatus } from "../entities/UploadHistory";

const repository = AppDataSource.getRepository(UploadHistory);

export class UploadService {
  private uploadRepository = AppDataSource.getRepository(UploadHistory);

  async createUpload(file: Express.Multer.File, uploadedByUserId: number) {
    const upload = this.uploadRepository.create({
      fileId: randomUUID(),
      uploadedByName: "John Doe",
      uploadedByEmail: "john.doe@example.com",
      originalFileName: file.originalname,
      storedFileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      uploadedByUserId,
      status: UploadStatus.PENDING,
      totalRows: 0,
      processedRows: 0,
      failedRows: 0,
    });

    return this.uploadRepository.save(upload);
  }
}
