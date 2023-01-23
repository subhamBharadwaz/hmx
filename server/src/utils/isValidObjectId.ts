import {isValidObjectId} from 'mongoose';
import {NextFunction} from 'express';
import {APIError} from './index';
import {HttpStatusCode} from '../types/http.model';

const isValidMongooseObjectId = (id: string, next: NextFunction) => {
	if (!isValidObjectId(id)) {
		const message = `${id} is not a valid id`;
		return next(new APIError(message, 'iusValidMongooseObject', HttpStatusCode.NOT_FOUND));
	}
};

export default isValidMongooseObjectId;
