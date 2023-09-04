/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable radix */
/* eslint-disable import/prefer-default-export */
import Order from '../order/order.model';
import {BaseError} from '../../utils';

export async function getTotalSales() {
	const pipeline = [
		// $unwind stage to deconstruct the orderItems array so that each item in the array becomes a separate document.
		{$unwind: '$orderItems'},

		// $project stage to calculate the revenue by multiplying the price and quantity fields inside the orderItems array.
		{
			$project: {
				revenue: {
					$multiply: ['$orderItems.price', '$orderItems.quantity']
				}
			}
		},

		// $group stage to calculate the total revenue for all documents
		{
			$group: {
				_id: null,
				totalRevenue: {$sum: '$revenue'}
			}
		},

		// $project stage to remove the _id field and rename the totalRevenue field
		{
			$project: {
				_id: 0,
				totalSales: '$totalRevenue'
			}
		}
	];

	try {
		const result = await Order.aggregate(pipeline);
		return result[0];
	} catch (error: any) {
		throw new BaseError('Could not perform getTotalSales operation', error, 'getTotalSales');
	}
}

interface MonthSales {
	name: string;
	totalRevenue: number;
}

export async function getSales(year: string) {
	const pipeline = [
		{
			// $match stage to filter the orders based on the specified year
			$match: {
				$expr: {
					$eq: [{$year: {date: '$createdAt', timezone: 'UTC'}}, parseInt(year)]
				}
			}
		},
		//  $unwind stage to deconstruct the orderItems array so that each item in the array becomes a separate document.
		{$unwind: '$orderItems'},
		// $project stage to calculate the revenue by multiplying the price and quantity fields inside the orderItems array.
		{
			$project: {
				revenue: {$multiply: ['$orderItems.price', '$orderItems.quantity']},
				month: {$month: {date: '$createdAt', timezone: 'UTC'}}
			}
		},
		// $group stage to group the documents by the month string and calculate the total revenue for each group
		{
			$group: {
				_id: '$month',
				totalRevenue: {$sum: '$revenue'}
			}
		},
		// $sort stage to sort the results by month in ascending order
		{
			$sort: {
				_id: 1
			}
		}
	];

	try {
		// @ts-ignore
		const salesData = await Order.aggregate<MonthSales>(pipeline);

		// Create an array of month objects with initial total revenue set to zero
		const monthsOfYear = [
			{name: 'Jan', totalRevenue: 0},
			{name: 'Feb', totalRevenue: 0},
			{name: 'Mar', totalRevenue: 0},
			{name: 'Apr', totalRevenue: 0},
			{name: 'May', totalRevenue: 0},
			{name: 'Jun', totalRevenue: 0},
			{name: 'Jul', totalRevenue: 0},
			{name: 'Aug', totalRevenue: 0},
			{name: 'Sep', totalRevenue: 0},
			{name: 'Oct', totalRevenue: 0},
			{name: 'Nov', totalRevenue: 0},
			{name: 'Dec', totalRevenue: 0}
		];

		// Loop through the sales data array and update the total revenue for the corresponding month object in the initial array.

		// eslint-disable-next-line no-restricted-syntax
		for (const sale of salesData) {
			// @ts-ignore
			const monthIndex = sale._id - 1;
			// eslint-disable-next-line security/detect-object-injection
			monthsOfYear[monthIndex].totalRevenue = sale.totalRevenue;
		}

		return monthsOfYear;
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
		return await Order.aggregate(pipeline);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform getSales by states operation',
			error,
			'getSalesByState'
		);
	}
}
