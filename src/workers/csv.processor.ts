import fs from "fs";
import csv from "csv-parser";

import { AppDataSource } from "../config/database";
import { EmployeeData } from "../entities/EmployeeData";
import { UploadHistory, UploadStatus } from "../entities/UploadHistory";

import { CsvEmployeeRow } from "../types/csv.types";
import { CSV_BATCH_SIZE } from "../constants/csv.constants";

export class CsvProcessor {
  private employeeRepository = AppDataSource.getRepository(EmployeeData);

  private uploadRepository = AppDataSource.getRepository(UploadHistory);

  async process(upload: UploadHistory): Promise<void> {
    return new Promise((resolve, reject) => {
      let batch: EmployeeData[] = [];
      let totalRows = 0;
      let processedRows = 0;
      let failedRows = 0;

      console.log("Processing File:", upload.filePath);

      const stream = fs.createReadStream(upload.filePath).pipe(csv());

      stream.on("headers", (headers) => {
        console.log("CSV Headers:", headers);
      });

      stream.on("data", (row: CsvEmployeeRow) => {
        stream.pause();

        (async () => {
          try {
            totalRows++;

            const employee = mapCsvRow(row, upload.id);

            batch.push(employee);

            if (batch.length >= CSV_BATCH_SIZE) {
              console.log(JSON.stringify(batch[0], null, 2));
              await this.employeeRepository.insert(batch);

              processedRows += batch.length;

              batch = [];

              await this.uploadRepository.update(upload.id, {
                totalRows,
                processedRows,
                failedRows,
              });

              console.log(`Imported ${processedRows} rows`);
            }
          } catch (error) {
            failedRows++;

            console.error("Row Error");
            console.error(error);
            console.error(row);
          } finally {
            stream.resume();
          }
        })();
      });

      stream.on("end", async () => {
        try {
          if (batch.length > 0) {
            await this.employeeRepository.insert(batch);

            processedRows += batch.length;
          }

          await this.uploadRepository.update(upload.id, {
            totalRows,
            processedRows,
            failedRows,
            status: UploadStatus.COMPLETED,
            completedAt: new Date(),
          });

          console.log("CSV Import Completed");

          resolve();
        } catch (error: any) {
          await this.uploadRepository.update(upload.id, {
            status: UploadStatus.FAILED,
            errorMessage: error.message,
          });

          reject(error);
        }
      });

      stream.on("error", async (error: any) => {
        console.error(error);

        await this.uploadRepository.update(upload.id, {
          status: UploadStatus.FAILED,
          errorMessage: error.message,
        });

        reject(error);
      });
    });
  }
}

export function mapCsvRow(row: CsvEmployeeRow, uploadId: number): EmployeeData {
  const employee = new EmployeeData();

  employee.uploadId = uploadId;

  employee.employeeId = row["Employee ID"];
  employee.employeeName = row["Employee Name"];
  employee.manager = row["Manager"];
  employee.businessUnit = row["Business Unit"];
  employee.department = row["Department"];
  employee.function = row["Function"];
  employee.account = row["Account"];
  employee.location = row["Location"];

  employee.workDate = new Date(row["Work Date"]);

  employee.loginTime = row["Login Time"];
  employee.logoutTime = row["Logout Time"];

  const toNumber = (value: string | undefined): number => {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  };

  employee.workingHours = toNumber(row["Working Hours"]);
  employee.productiveHours = toNumber(row["Productive Hours"]);
  employee.idleHours = toNumber(row["Idle Hours"]);
  employee.productivity = toNumber(row["Productivity"]);

  return employee;
}
