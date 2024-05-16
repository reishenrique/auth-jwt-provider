import nodemailer from "nodemailer";
import "dotenv/config";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
} as SMTPTransport.Options);

export const send = (to: string, subject: string, body: string) => {
	transporter.sendMail({
		from: process.env.MAIL_FROM,
		to,
		subject,
		text: body,
	});
};

export const validateMailbox = async (email: string): Promise<boolean> => {
	const domain = email.split("@")[1];

	const transporter = nodemailer.createTransport({
		host: `smtp.${domain}`,
		port: process.env.MAIL_PORT,
		sucure: false,
		tls: {
			rejectUnauthorized: false,
		},
	} as SMTPTransport.Options);

	try {
		await transporter.verify();
		return true;
	} catch (error) {
		return false;
	}
};
