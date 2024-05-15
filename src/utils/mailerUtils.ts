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
