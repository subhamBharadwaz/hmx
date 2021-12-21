import mongoose from 'mongoose';
import config from 'config';

export const connectToDB = () => {
	const dbUrl = config.get<string>('dbUrl');
	mongoose
		.connect(dbUrl)
		.then(result => console.log(`DB GOT CONNECTED`))
		.catch(err => {
			console.error(`DB Connection Issue , ${err}`);
			process.exit(1);
		});
};
