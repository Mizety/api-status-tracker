import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Form } from "@/types/api";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import ExcelJS from "exceljs";

export async function exportSubmissions(submissions: Form[], type = "excel") {
  if (type === "excel") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Submissions");

    // Add headers
    worksheet.addRow(["ID", "Name", "Email", "Company", "Status", "Submitted"]);

    submissions.forEach((submission) => {
      //convert submission to an array
      const submissionArray = Object.values(submission);
      worksheet.addRow(submissionArray);
    });

    // Generate buffer and create download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "submissions.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
    return workbook;
  }
  if (type === "csv") {
    const csv = submissions
      .map((submission) => Object.values(submission).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "submissions.csv";
    link.click();
    window.URL.revokeObjectURL(url);
    return csv;
  }
}
