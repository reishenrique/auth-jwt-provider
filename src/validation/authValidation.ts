import { z } from 'zod'

export const AuthInput = z.object({
    userName: z.string(),
    email: z.string(),
    password: z.string()
})
