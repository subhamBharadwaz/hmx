import config from 'config';
import mongoose from 'mongoose';
import {logger} from '@util/index';

const connectToDB = () => {
	const dbUrl = config.get<string>('dbUrl');
	mongoose
		.connect(dbUrl)
		.then(() => logger.info(`DB GOT CONNECTED`))
		.catch(err => {
			logger.error(`DB Connection Issue , ${err}`);
			process.exit(1);
		});
};

export default connectToDB;
