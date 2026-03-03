import IIdName from "../../interfaces/generic/id-name.interface";
import { TSubResource } from "./sub-resources.type";

export type TResource = {
  icon: string;
  path: string;
  subresources: TSubResource[];
  actions: string[];
} & IIdName