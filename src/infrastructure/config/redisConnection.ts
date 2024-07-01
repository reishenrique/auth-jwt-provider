import type { RedisOptions } from "ioredis";
import { env } from "../config/validateEnv"

export const connection: RedisOptions = {
	host: env.REDIS_HOST,
	port: 6379,
};
