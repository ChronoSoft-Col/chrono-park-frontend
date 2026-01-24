import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import TUser from "@/src/shared/types/auth/user.type";
import { TApplication } from "@/src/shared/types/auth/application.type";

export type ILoginData = {
	access_token: string;
	refresh_token?: string;
	role?: { id: string; name: string } | null;
	user: Partial<TUser> & { id: string; name?: string | null; email?: string | null };
	applications?: TApplication[];
};

// Respuesta genérica del backend con el objeto de login en `data`
export type ILoginResponse = IGeneralResponse<ILoginData>;