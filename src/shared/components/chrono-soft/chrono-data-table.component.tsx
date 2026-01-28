"use client";

import { ReactNode, isValidElement } from "react";

import { cn } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

const alignmentClassMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export type ChronoDataTableAlignment = keyof typeof alignmentClassMap;

export type ChronoDataTableColumn<T extends object> = {
  id?: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => ReactNode;
  header: ReactNode;
  cell?: (row: T, rowIndex: number) => ReactNode;
  align?: ChronoDataTableAlignment;
  headerClassName?: string;
  cellClassName?: string;
};

export type ChronoDataTableProps<T extends object> = {
  data: T[];
  columns: ChronoDataTableColumn<T>[];
  caption?: ReactNode;
  emptyMessage?: ReactNode;
  loadingMessage?: ReactNode;
  isLoading?: boolean;
  /** Número de filas skeleton a mostrar mientras carga (default: 5) */
  skeletonRows?: number;
  getRowKey?: (row: T, index: number) => string | number;
  className?: string;
};

export function ChronoDataTable<T extends object>({
  data,
  columns,
  caption,
  emptyMessage = "Sin resultados",
  loadingMessage = "Cargando datos…",
  isLoading = false,
  skeletonRows = 5,
  getRowKey,
  className,
}: ChronoDataTableProps<T>) {
  const resolveRowKey = (row: T, index: number) =>
    getRowKey?.(row, index) ?? (row as { id?: string | number })?.id ?? index;

  const showEmptyState = !isLoading && data.length === 0;

  const ensureRenderableValue = (value: unknown): ReactNode => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string" || typeof value === "number") return value;
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (value instanceof Date) return value.toLocaleString();
    if (isValidElement(value as ReactNode)) return value as ReactNode;

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  return (
    <Table className={className}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column, columnIndex) => (
            <TableHead
              key={column.id ?? String(column.accessorKey ?? columnIndex)}
              className={cn(alignmentClassMap[column.align ?? "left"], column.headerClassName)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: skeletonRows }).map((_, rowIdx) => (
            <TableRow key={`skeleton-row-${rowIdx}`} className="animate-pulse">
              {columns.map((column, colIdx) => (
                <TableCell
                  key={`skeleton-cell-${rowIdx}-${colIdx}`}
                  className={cn(
                    alignmentClassMap[column.align ?? "left"],
                    column.cellClassName
                  )}
                >
                  <Skeleton className="h-4 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {showEmptyState && (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-xs text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          data.map((row, rowIndex) => (
            <TableRow key={resolveRowKey(row, rowIndex)}>
              {columns.map((column, columnIndex) => {
                const alignmentClass = alignmentClassMap[column.align ?? "left"];
                let cellContent: ReactNode = null;

                if (column.cell) {
                  cellContent = column.cell(row, rowIndex);
                } else if (column.accessorFn) {
                  cellContent = column.accessorFn(row);
                } else if (column.accessorKey) {
                  const key = String(column.accessorKey);
                  cellContent = ensureRenderableValue((row as Record<string, unknown>)[key]);
                }

                return (
                  <TableCell
                    key={`${column.id ?? String(column.accessorKey ?? columnIndex)}-${rowIndex}`}
                    className={cn(alignmentClass, column.cellClassName)}
                  >
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
