import IIdName from "../../interfaces/generic/id-name.interface";

export type TSubResource = {
  path: string;
  icon: string;
  action: string[];
} & IIdName