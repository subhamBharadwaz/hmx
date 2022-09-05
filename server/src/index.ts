/* eslint-disable import/first */
import dotEnv from 'dotenv';

dotEnv.config();
import {Request, Response, NextFunction} from 'express';

import config from 'config';
import {v2 as cloudinary} from 'cloudinary';
import app from './app';
import {connectToDB, logger, ErrorHandler, BaseError} from './utils';
import {disconnectFromDatabase} from './utils/db';

// connect to database
connectToDB();

// cloudinary config
cloudinary.config({
	cloud_name: config.get<string>('cloudinaryName'),
	api_key: config.get<string>('cloudinaryApiKey'),
	api_secret: config.get<string>('cloudinaryApiSecret')
});

const PORT = config.get<number>('port');

app.use(errorMiddleware);

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

const errorHandler = new ErrorHandler(logger);

process.on('uncaughtException', async (error: Error) => {
	await errorHandler.handleError(error);
	if (!errorHandler.isTrustedError(error)) process.exit(1);
});

process.on('unhandledRejection', (reason: Error) => {
	throw reason;
});

async function errorMiddleware(err: BaseError, req: Request, res: Response, next: NextFunction) {
	if (!errorHandler.isTrustedError(err)) {
		next(err);
		return;
	}
	await errorHandler.handleError(err);
}
