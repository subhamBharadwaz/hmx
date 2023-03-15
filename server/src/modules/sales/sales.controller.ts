/* eslint-disable radix */
/* eslint-disable import/prefer-default-export */
import {Request, Response, NextFunction} from 'express';

import {BigPromise} from '../../middlewares';

import {HttpStatusCode} from '../../types/http.model';
import {APIError} from '../../utils';
import {getSales, getSalesByState} from './sales.service';

/** 
@desc    Get Sales Details
@route   GET /api/v1/sales/:year/:month
@access  Private
*/
export const handleAdminGetSalesDataHandler = BigPromise(
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

/** 
@desc    Get Sales Details by States
@route   GET /api/v1/sales/state
@access  Private
*/
export const handleAdminGetSalesByStates = BigPromise(async (req: Request, res: Response) => {
	const {year, month} = req.query;

	const matchQuery: any = {'shippingInfo.state': {$exists: true}};

	if (year && month) {
		matchQuery.$expr = {
			$and: [
				{$eq: [{$year: '$createdAt'}, parseInt(year as string)]},
				{$eq: [{$month: '$createdAt'}, parseInt(month as string)]}
			]
		};
	}

	const salesData = await getSalesByState(matchQuery);

	res.status(200).json({success: true, salesData});
});
