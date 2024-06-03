import { promises as dns } from "node:dns";

export const validateEmailDomain = async (email: string): Promise<boolean> => {
	const domain = email.split("@")[1];

	try {
		const records = await dns.resolveMx(domain);
		return records && records.length > 0;
	} catch (error) {
		return false;
	}
};
