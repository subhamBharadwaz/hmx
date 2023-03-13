/* eslint-disable radix */
/* eslint-disable import/prefer-default-export */
import Order from '../order/order.model';
import {BaseError} from '../../utils';

export async function getSales(year: string, month: string) {
	const pipeline = [
		{
			$match: {
				$expr: {
					$and: [
						{$eq: [{$year: {date: '$createdAt', timezone: 'UTC'}}, parseInt(year)]},
						{$eq: [{$month: {date: '$createdAt', timezone: 'UTC'}}, parseInt(month)]}
					]
				}
			}
		},
		{$unwind: '$orderItems'},
		{
			$project: {
				revenue: {
					$multiply: ['$orderItems.price', '$orderItems.quantity']
				},
				yearMonth: {$dateToString: {format: '%Y-%m', date: '$createdAt', timezone: 'UTC'}}
			}
		},
		{
			$group: {
				_id: '$yearMonth',
				totalRevenue: {$sum: '$revenue'}
			}
		},
		{
			$project: {
				_id: 0,
				yearMonth: '$_id',
				totalRevenue: 1
			}
		}
	];

	try {
		return Order.aggregate(pipeline);
	} catch (error: any) {
		throw new BaseError('Could not perform create user operation', error, 'createOrder');
	}
}
