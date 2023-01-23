import {Response, NextFunction} from 'express';
import {IGetUserAuthInfoRequest} from '../modules/user/user.types';
import {APIError} from '../utils';
import {HttpStatusCode} from '../types/http.model';

const customRole = (...roles: string[]) => {
	return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			const message = 'You are not allowed for this resource';
			return next(new APIError(message, 'customRole', HttpStatusCode.FORBIDDEN));
		}
		next();
	};
};

export default customRole;
