import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export enum UploadStatus {
  PENDING = "PENDING",
  VALIDATING = "VALIDATING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity("upload_history")
export class UploadHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  fileId!: string;

  @Column()
  originalFileName!: string;

  @Column()
  storedFileName!: string;

  @Column()
  filePath!: string;

  @Column("bigint")
  fileSize!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "uploadedByUserId" })
  uploadedBy!: User;

  @Column()
  uploadedByUserId!: number;

  @Column()
  uploadedByName!: string;

  @Column()
  uploadedByEmail!: string;

  @Column({
    type: "enum",
    enum: UploadStatus,
    default: UploadStatus.PENDING,
  })
  status!: UploadStatus;

  @Column({ default: 0 })
  totalRows!: number;

  @Column({ default: 0 })
  processedRows!: number;

  @Column({ default: 0 })
  failedRows!: number;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column({ type: "timestamp", nullable: true })
  startedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  completedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
