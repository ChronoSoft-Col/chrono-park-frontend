import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { IPaymentsReportData } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";

export function exportReportToExcel(
  reportData: IPaymentsReportData,
  startDate: string,
  endDate: string,
) {
  const rows = reportData.payments.map((p) => ({
    "#": p.index,
    Consecutivo: p.consecutive,
    Total: p.total,
    Fecha: p.dateFormatted,
    Conceptos: p.details.map((d) => `${d.concept}: $${d.amount.toLocaleString()}`).join("; "),
    "Método de pago": p.paymentMethod,
    Notas: p.notes ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Auto-size columns
  const colWidths = Object.keys(rows[0] ?? {}).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String((r as Record<string, unknown>)[key] ?? "").length),
    );
    return { wch: Math.min(maxLen + 2, 50) };
  });
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte de pagos");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `Reporte_Pagos_${startDate}_${endDate}.xlsx`;
  saveAs(blob, fileName);
}
