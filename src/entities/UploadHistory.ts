import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum UploadStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity("upload_history")
export class UploadHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;

  @Column()
  originalName!: string;

  @Column({
    type: "enum",
    enum: UploadStatus,
    default: UploadStatus.PENDING,
  })
  status!: UploadStatus;

  @Column({
    default: 0,
  })
  totalRows!: number;

  @Column({
    default: 0,
  })
  processedRows!: number;

  @Column({
    default: 0,
  })
  failedRows!: number;

  @CreateDateColumn()
  uploadedAt!: Date;
}
