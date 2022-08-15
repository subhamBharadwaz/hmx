import {Response, NextFunction} from 'express';
import {CustomError, logger} from '../utils/index';
import {IGetUserAuthInfoRequest} from '../types/types.user';

const customRole = (...roles: string[]) => {
	return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			const logErr = new CustomError('You are not allowed for this resource', 403);
			logger.error(logErr);
			return next(logErr);
		}
		next();
	};
};

export default customRole;
