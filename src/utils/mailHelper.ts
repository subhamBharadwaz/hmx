import nodemailer, {TransportOptions} from 'nodemailer';

interface IMailOptions {
	email: string;
	subject: string;
	message: string;
}

const mailHelper = async (option: IMailOptions) => {
	const transporter = nodemailer.createTransport({
		host: `${process.env.SMTP_HOST}`,
		port: `${process.env.SMTP_PORT}`,
		auth: {
			user: `${process.env.SMTP_USER}`, // generated ethereal user
			pass: `${process.env.SMTP_PASS}` // generated ethereal password
		}
	} as TransportOptions);

	const message = {
		from: 'Subham from <hmx.com>', // sender address
		to: option.email, // list of receivers
		subject: option.subject, // Subject line
		text: option.message // plain text body
		//TODO html: option.link
	};
	// send mail with defined transport object
	await transporter.sendMail(message);
};

export default mailHelper;
