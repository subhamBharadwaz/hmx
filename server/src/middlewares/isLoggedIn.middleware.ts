import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../modules/user/user.model';
import {APIError} from '../utils/index';
import {HttpStatusCode} from '../types/http.model';
import {BigPromise} from './index';
import {IGetUserAuthInfoRequest, IJwtPayload} from '../modules/user/user.types';

const isLoggedIn = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const token: string =
			req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			const message = 'Login first to access this page';
			return next(new APIError(message, 'isLoggedIn', HttpStatusCode.FORBIDDEN));
		}

		const decoded = jwt.verify(token, config.get<string>('jwtSecret')) as IJwtPayload;

		req.user = await User.findById(decoded.id);

		next();
	}
);

export default isLoggedIn;
