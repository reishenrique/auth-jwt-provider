import { app } from "../src/app";
import "dotenv/config";
import mongoose from "mongoose";

const port = process.env.PORT || 3000;
const stringConnection = process.env.DATABASE_URL as string;

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
