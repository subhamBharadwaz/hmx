import {HttpStatusCode} from '../types/http.model';

class BaseError extends Error {
	public readonly log: string;

	public readonly methodName: string | undefined;

	public readonly httpCode: HttpStatusCode;

	public readonly isOperational: boolean;

	constructor(
		log: string,
		// eslint-disable-next-line default-param-last
		message: string | unknown = log,
		methodName?: string,
		httpCode = HttpStatusCode.INTERNAL_SERVER,
		isOperational = true
	) {
		super(<string>message);
		Object.setPrototypeOf(this, new.target.prototype);

		this.log = log;
		if (methodName) this.methodName = methodName;
		this.httpCode = httpCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this);
	}
}

export default BaseError;
