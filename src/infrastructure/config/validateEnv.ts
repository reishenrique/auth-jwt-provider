import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
	PORT: z.string({
		required_error: "[PORT] is required",
		invalid_type_error: "Port must be a string",
	}),
	SECRET: z.string({
		required_error: "JWT [SECRET] is required",
		invalid_type_error: "JWT [SECRET] must be a string",
	}),
	DATABASE_URL: z.string({
		required_error: "[DATABASE_URL] connection is required",
		invalid_type_error: "[DATABASE_URL] must be a string",
	}),
	MAIL_HOST: z.string({
		required_error: "[MAIL_HOST] is required",
		invalid_type_error: "[MAIL_HOST] must be a string",
	}),
	MAIL_PORT: z.string({
		required_error: "[MAIL_PORT] is required",
		invalid_type_error: "[MAIL_PORT] must be a string",
	}),
	MAIL_USER: z.string({
		required_error: "[MAIL_USER] is required",
		invalid_type_error: "[MAIL_USER] must be a string",
	}),
	MAIL_PASS: z.string({
		required_error: "[MAIL_PASS] is required",
		invalid_type_error: "[MAIL_PASS] must be a string",
	}),
	MAIL_FROM: z.string({
		required_error: "[MAIL FROM] is required",
		invalid_type_error: "[MAIL FROM] must be a string",
	}),
	REDIS_HOST: z.string({
		required_error: "[REDIS_HOST] is required",
		invalid_type_error: "Redis Host must be a string"
	})
});

export const env = envSchema.parse(process.env);
