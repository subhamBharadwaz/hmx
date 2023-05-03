/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from 'config';
import jwt from 'jsonwebtoken';
import {Response, NextFunction} from 'express';
import {IGetUserAuthInfoRequest} from '../modules/user/user.types';
import User from '../modules/user/user.model';

const isLoggedIn = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!(authHeader as string)?.startsWith('Bearer ')) {
		return res.status(401).json({message: 'Unauthorized'});
	}

	const token = (authHeader as string).split(' ')[1];

	jwt.verify(token, config.get<string>('accessTokenSecret'), async (err, decoded) => {
		if (err) return res.status(403).json({message: 'Login first to access'});
		// @ts-ignore
		req.user = await User.findById({_id: decoded?.id});

		next();
	});
};

export default isLoggedIn;
