import { z } from "zod";

export const passwordRecoveryValidation = z.object({
	email: z.string().email(),
});
