import { randomUUID } from "crypto";
import { AppDataSource } from "../config/database";
import { UploadHistory, UploadStatus } from "../entities/UploadHistory";
import { CsvProcessor } from "../workers/csv.processor";

const repository = AppDataSource.getRepository(UploadHistory);

export class UploadService {
  private uploadRepository = AppDataSource.getRepository(UploadHistory);
  private csvProcessor = new CsvProcessor();

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

  async processCsv(uploadId: number) {
    console.info(`Starting CSV processing for upload ID: ${uploadId}`);
    const upload = await this.uploadRepository.findOne({
      where: { id: uploadId },
    });

    if (!upload) {
      throw new Error("Upload not found");
    }

    if (upload.status === UploadStatus.COMPLETED) {
      throw new Error("This file has already been processed.");
    }

    await this.uploadRepository.update(upload.id, {
      status: UploadStatus.PROCESSING,
      startedAt: new Date(),
    });

    console.log("PENDING", upload);
    await this.csvProcessor.process(upload);
  }

  async getUploadStatus(uploadId: number) {
    const upload = await this.uploadRepository.findOne({
      where: { id: uploadId },
    });

    if (!upload) {
      throw new Error("Upload not found");
    }

    return upload;
  }

  async getUploads() {
    return await this.uploadRepository.find({
      relations: {
        uploadedBy: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }
}
