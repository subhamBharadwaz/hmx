/* eslint-disable import/first */
import dotEnv from 'dotenv';

dotEnv.config();
import config from 'config';
import {v2 as cloudinary} from 'cloudinary';
import app from '@src/app';
import {connectToDB, logger} from '@util/index';
import {disconnectFromDatabase} from '@util/db';

// connect to database
connectToDB();

// cloudinary config
cloudinary.config({
	cloud_name: config.get<string>('cloudinaryName'),
	api_key: config.get<string>('cloudinaryApiKey'),
	api_secret: config.get<string>('cloudinaryApiSecret')
});

const PORT = config.get<number>('port');

const server = app.listen(PORT, () => {
	logger.info(`Server is running at http://localhost:${PORT}`);
	logger.info(`Docs are at http://localhost:${PORT}/api-docs`);
});

const signals = ['SIGTERM', 'SIGINT'];

function gracefulShutdown(signal: string) {
	process.on(signal, async () => {
		server.close();

		// Disconnect from the database
		await disconnectFromDatabase();

		logger.info('Goodbye, got signal', signal);

		process.exit(0);
	});
}

// eslint-disable-next-line no-plusplus
for (let i = 0; i < signals.length; i++) {
	// eslint-disable-next-line security/detect-object-injection
	gracefulShutdown(signals[i]);
}
