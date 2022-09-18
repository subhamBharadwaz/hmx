import config from 'config';
import mongoose from 'mongoose';
import {logger} from './index';

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

export async function disconnectFromDatabase() {
	await mongoose.connection.close();
	logger.info('Disconnected from database');
	// eslint-disable-next-line no-useless-return
	return;
}
