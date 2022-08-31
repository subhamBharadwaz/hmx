import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../modules/user/user.model';
import {CustomError, logger} from '../utils/index';
import {BigPromise} from './index';
import {IGetUserAuthInfoRequest, IJwtPayload} from '../modules/user/user.types';

// log error
let logErr;

const isLoggedIn = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const token: string =
			req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			logErr = new CustomError('Login first to access this page', 401);
			return next(logger.error(logErr));
		}

		const decoded = jwt.verify(token, config.get<string>('jwtSecret')) as IJwtPayload;

		req.user = await User.findById(decoded.id);

		next();
	}
);

export default isLoggedIn;
