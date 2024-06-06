import { Queue, Worker } from "bullmq";
import { connection } from "../config/redisConnection";
import { SignUpUseCase } from "../../domain/useCase/signUpUseCase";
import { UserRepository } from "../../application/repositories/userRepository";

const signUpQueue = new Queue("signUpQueue", { connection });

const worker = new Worker(
	"signUpQueue",
	async (job) => {
		try {
			const userRepository = new UserRepository();
			const signUpUseCase = new SignUpUseCase(userRepository);

			await signUpUseCase.execute(job.data);
			console.log(`Job: ${job.id}, completed`);
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Job: ${job.id} failed with error ${error.message}`);
			}

			// console.error(`Job: ${job.id} failed with an unknown error`);
		}
	},
	{ connection },
);

export { signUpQueue, worker };
