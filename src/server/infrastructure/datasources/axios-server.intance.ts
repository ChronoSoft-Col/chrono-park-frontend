import { getServerApi } from "@/src/lib/axios-server";
import { AxiosInstance } from "axios";

export abstract class AxiosServerInstance {
  protected api: AxiosInstance;

  constructor(queryParams?: Record<string, unknown>) {
    this.api = getServerApi(queryParams);
  }
}
