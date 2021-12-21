import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/user.model';
import CustomError from '../utils/customError';
import BigPromise from '../middlewares/bigPromise';
import {IGetUserAuthInfoRequest, IJwtPayload} from '../types/types.user';

export const isLoggedIn = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const token: string =
			req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return next(new CustomError('Login first to access this page', 401));
		}

		const decoded = jwt.verify(token, config.get<string>('jwtSecret')) as IJwtPayload;

		req.user = await User.findById(decoded.id);

		next();
	}
);
