/* eslint-disable class-methods-use-this */
import logger from '../logger';
import BaseError from './baseError';

class ErrorHandler {
	logger;

	// eslint-disable-next-line @typescript-eslint/no-shadow
	constructor(logger: any) {
		this.logger = logger;
	}

	public async handleError(err: Error): Promise<void> {
		logger.error(err);
	}

	public isTrustedError(error: Error) {
		return error instanceof BaseError && error.isOperational;
	}
}
export default ErrorHandler;
