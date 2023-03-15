/* eslint-disable radix */
/* eslint-disable import/prefer-default-export */
import Order from '../order/order.model';
import {BaseError} from '../../utils';

export async function getSales(year: string, month: string) {
	const pipeline = [
		{
			// $match stage to filter the orders based on the specified year and month
			$match: {
				$expr: {
					$and: [
						{$eq: [{$year: {date: '$createdAt', timezone: 'UTC'}}, parseInt(year)]},
						{$eq: [{$month: {date: '$createdAt', timezone: 'UTC'}}, parseInt(month)]}
					]
				}
			}
		},
		//  $unwind stage to deconstruct the orderItems array so that each item in the array becomes a separate document.
		{$unwind: '$orderItems'},

		// $project stage to calculate the revenue by multiplying the price and quantity fields inside the orderItems array.
		{
			$project: {
				revenue: {
					$multiply: ['$orderItems.price', '$orderItems.quantity']
				},
				yearMonth: {$dateToString: {format: '%Y-%m', date: '$createdAt', timezone: 'UTC'}}
			}
		},

		// $group stage to group the documents by the year-month string and calculate the total revenue for each group
		{
			$group: {
				_id: '$yearMonth',
				totalRevenue: {$sum: '$revenue'}
			}
		},

		// finally,  $project stage to rename the _id field to yearMonth and remove the $ symbol from the field name.
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
		throw new BaseError('Could not perform getSales operation', error, 'getSales');
	}
}

export async function getSalesByState(matchQuery: any) {
	const pipeline = [
		{$match: matchQuery},
		{
			$project: {
				_id: 0,
				state: '$shippingInfo.state',
				itemRevenue: {
					$map: {
						input: '$orderItems',
						in: {$multiply: ['$$this.price', '$$this.quantity']}
					}
				}
			}
		},
		{
			$project: {
				state: 1,
				totalRevenue: {$sum: '$itemRevenue'}
			}
		},
		{
			$group: {
				_id: '$state',
				totalRevenue: {$sum: '$totalRevenue'}
			}
		}
	];

	try {
		return Order.aggregate(pipeline);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform getSales by states operation',
			error,
			'getSalesByState'
		);
	}
}
