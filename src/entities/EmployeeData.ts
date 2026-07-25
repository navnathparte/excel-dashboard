import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from "typeorm";
import { UploadHistory } from "./UploadHistory";

@Entity("employee_data")
@Index(["employeeId"])
@Index(["workDate"])
@Index(["location"])
@Index(["businessUnit"])
@Index(["manager"])
export class EmployeeData {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UploadHistory)
  @JoinColumn({ name: "uploadId" })
  upload!: UploadHistory;

  @Column()
  uploadId!: number;

  @Column()
  employeeId!: string;

  @Column()
  employeeName!: string;

  @Column()
  manager!: string;

  @Column()
  businessUnit!: string;

  @Column()
  department!: string;

  @Column()
  function!: string;

  @Column()
  account!: string;

  @Column()
  location!: string;

  @Column({ type: "date" })
  workDate!: Date;

  @Column({ nullable: true })
  loginTime?: string;

  @Column({ nullable: true })
  logoutTime?: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  workingHours!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  productiveHours!: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  idleHours!: number;

  @Column("decimal", { precision: 5, scale: 2, default: 0 })
  productivity!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
