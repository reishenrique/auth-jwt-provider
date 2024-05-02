import { z } from 'zod'

export const AuthInput = z.object({
    email: z.string(),
    password: z.string()
})
