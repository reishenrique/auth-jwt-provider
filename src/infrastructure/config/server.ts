import { app } from "../config/app";
import { env } from "../config/validateEnv";
import mongoose from "mongoose";

const port = env.PORT || 3000;
const stringConnection = env.DATABASE_URL as string;

export const serverConnection = async () => {
	const mongooseConnection = await mongoose.connect(stringConnection);
	if (mongooseConnection) {
		app.listen(port, () => {
			console.log(`MongoDB Connected / Server running on port: ${port}`);
		});
	}

	return mongooseConnection;
};

serverConnection();
