import type { IPrinterOperationEntity } from "../../entities/printer/printer-operation.entity";

export type PrinterAlign = "left" | "center" | "right";
export type PrinterFontSize = 1 | 2 | 3;

// IMPORTANT:
// The Java printer service expects the action name "textaling" (typo) for alignment.
// Do NOT change it unless you also change the printer server.
export type PrinterAction =
  | "text"
  | "textaling"
  | "feed"
  | "cut"
  | "fontsize"
  | "pdf417"
  | "qr"
  | "barcode_93"
  | "barcode_128"
  | "barcode_ean13"
  | "img_url";

function op(accion: PrinterAction, datos: string): IPrinterOperationEntity {
  return { accion, datos };
}

export const printerOps = {
  text: (value: string) => op("text", value),
  align: (value: PrinterAlign) => op("textaling", value),
  feed: (lines: number) => op("feed", String(lines)),
  cut: () => op("cut", ""),
  fontSize: (size: PrinterFontSize) => op("fontsize", String(size)),

  pdf417: (value: string) => op("pdf417", value),
  qr: (value: string) => op("qr", value),
  barcode93: (value: string) => op("barcode_93", value),
  barcode128: (value: string) => op("barcode_128", value),
  barcodeEan13: (value: string) => op("barcode_ean13", value),
  imgUrl: (value: string) => op("img_url", value),

  separator: () => op("text", "----------------------------------------"),
  strongSeparator: () => op("text", "========================================"),
};
