import { Queue, Worker } from "bullmq";
import { connection } from "../config/redisConnection";
import { SignUpUseCase } from "../../domain/useCase/signUpUseCase";
import { UserRepository } from "../../application/repositories/userRepository";

const userQueue = new Queue("userQueue", { connection });

const worker = new Worker(
	"userQueue",
	async (job) => {
		try {
			const userRepository = new UserRepository();
			const signUpUseCase = new SignUpUseCase(userRepository);

			await signUpUseCase.execute(job.data);
			console.log(`Job ${job.id} completed`);
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Job: ${job.id} failed with error ${error.message}`);
			} else {
				console.error(`Job: ${job.id} failed with an unknown error`);
			}
		}
	},
	{ connection },
);

export { userQueue, worker };
