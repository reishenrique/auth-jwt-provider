import nodemailer from "nodemailer";
import { env } from "../config/validateEnv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
	host: env.MAIL_HOST,
	port: env.MAIL_PORT as unknown as number,
	auth: {
		user: env.MAIL_USER,
		pass: env.MAIL_PASS,
	},
} as SMTPTransport.Options);

export const send = (to: string, subject: string, body: string) => {
	transporter.sendMail({
		from: env.MAIL_FROM,
		to,
		subject,
		text: body,
	});
};

export const validateMailbox = async (email: string): Promise<boolean> => {
	const domain = email.split("@")[1];

	const transporter = nodemailer.createTransport({
		host: `smtp.${domain}`,
		port: env.MAIL_PORT,
		sucure: false,
		tls: {
			rejectUnauthorized: false,
		},
	} as unknown as SMTPTransport.Options);

	try {
		await transporter.verify();
		return true;
	} catch (error) {
		return false;
	}
};
