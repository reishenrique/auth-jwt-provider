import { z } from "zod";

export const SignInValidation = z.object({
	email: z.string(),
	password: z.string(),
});
