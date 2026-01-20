import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PaginatedPayload } from "../shared/interfaces/generic/general-response.interface"
import { DEFAULT_LIMIT } from "../shared/constants/pagination";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function resolveMetaData<T>(data: PaginatedPayload<T>){
  const {items, meta} = data;

  const total = meta?.total ?? items.length;
  const totalPages = meta?.totalPages ?? Math.ceil(total / (meta?.limit ?? DEFAULT_LIMIT));
  const pageSize = meta?.limit ?? DEFAULT_LIMIT;
  const page = meta?.page ?? 1;

  return { total, totalPages, pageSize, items, page };
}