import nodemailer, {TransportOptions} from 'nodemailer';
import config from 'config';
interface IMailOptions {
	email: string;
	subject: string;
	message: string;
}

const mailHelper = async (option: IMailOptions) => {
	const transporter = nodemailer.createTransport({
		host: config.get<string>('smtpHost'),
		port: config.get<number>('smtpPort'),
		auth: {
			user: config.get<string>('smtpUser'),
			pass: config.get<string>('smtpPass')
		}
	} as TransportOptions);

	/**
	 * //? For Gmail
	 * 
	 *  var transporter = nodemailer.createTransport({
	 	service: 'gmail',
		auth: {
	 		user: '',
 		    pass: ''
 	    }
	  });
	 */

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
