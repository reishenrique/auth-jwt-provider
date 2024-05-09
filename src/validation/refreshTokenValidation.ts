import { z } from "zod";

export const refreshTokenValidation = z.object({
	email: z.string().email(),
	refreshToken: z.string(),
});
