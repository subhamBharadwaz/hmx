class CustomError extends Error {
	httpCode: number;

	constructor(message: string, httpCode: number) {
		super(message);

		// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
		Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

		this.httpCode = httpCode;

		Error.captureStackTrace(this);
	}
}

export default CustomError;
