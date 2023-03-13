/* eslint-disable import/prefer-default-export */
import {Request, Response, NextFunction} from 'express';

import {BigPromise} from '../../middlewares';

import {HttpStatusCode} from '../../types/http.model';
import {APIError} from '../../utils';
import {getSales} from './sales.service';

/** 
@desc    Get Sales Details
@route   GET /api/v1/order/id
@access  Private
*/
export const getSalesDataHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {year, month} = req.params;

		if (!year || !month) {
			const message = 'Please enter year and month';
			return next(new APIError(message, 'getSalesDataHandler', HttpStatusCode.BAD_REQUEST));
		}

		const salesData = await getSales(year, month);

		res.status(200).json({success: true, salesData});
	}
);
