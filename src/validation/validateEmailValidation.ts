import { z } from "zod";

export const validateEmailValidation = z.object({
	email: z.string(),
});
