import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { TPermission } from "@/src/shared/types/auth/permission.type";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetPermissionsResponse extends IGeneralResponse<TPermission>{}