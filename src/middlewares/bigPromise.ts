import {Request, Response, NextFunction} from 'express';

interface ICallback {
	(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * This big promise takes a function and try to execute that in a promise way
 *
 * Wrap it around to the asynchronous methods to not to use try/catch and async/await
 */

export default (func: ICallback) => (req: Request, res: Response, next: NextFunction) =>
	Promise.resolve(func(req, res, next)).catch(next);
