import {isValidObjectId} from 'mongoose';
import {NextFunction} from 'express';
import {CustomError, logger} from '@util/index';

const isValidMongooseObjectId = (id: string, next: NextFunction) => {
	if (!isValidObjectId(id)) {
		const logErr = new CustomError(`${id} is not a valid id`, 400);
		logger.error(logErr);
		return next(logErr);
	}
};

export default isValidMongooseObjectId;
