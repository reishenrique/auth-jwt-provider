import { z } from "zod";

export const signUpValidation = z.object({
	userName: z.string().optional(),
	email: z.string().email().optional(),
	password: z.string().optional(),
});
