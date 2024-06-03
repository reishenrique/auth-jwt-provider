import { z } from "zod";

export const refreshTokenValidation = z.object({
	email: z.string().optional(),
	refreshToken: z.string().optional(),
});
