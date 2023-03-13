import Product from './product.model';
import Order from '../order/order.model';
import {BaseError} from '../../utils';
import {IProductDocument} from './product.types';

export async function totalProducts() {
	try {
		return Product.countDocuments();
	} catch (error: any) {
		throw new BaseError(
			'Could not perform count total products operation',
			error,
			'totalProducts'
		);
	}
}

export async function findProduct() {
	try {
		return Product.find();
	} catch (error: any) {
		throw new BaseError('Could not perform find products operation', error, 'findProduct');
	}
}

export async function findOneProduct(productId: string) {
	try {
		return Product.findOne({_id: productId});
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find one product operation',
			error,
			'findOneProduct'
		);
	}
}

// eslint-disable-next-line no-undef
export async function findProductById(id: unknown) {
	try {
		return Product.findById(id);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find product bt id operation',
			error,
			'findProductById'
		);
	}
}

export async function updateProductById(
	// eslint-disable-next-line no-undef
	id: any,
	data: any
) {
	try {
		return Product.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		});
	} catch (error: any) {
		throw new BaseError(
			'Could not perform update product operation',
			error,
			'updateProductById'
		);
	}
}

export async function getTopSellingProducts() {
	try {
		return Order.aggregate([
			//  we use the $unwind aggregation pipeline to unwind the orderItems array and create a separate document for each item in the array
			{$unwind: '$orderItems'},
			{
				// use the $group pipeline to group the documents by product and calculate the quantity sold ($sum) and total revenue ($sum) for each group.
				$group: {
					_id: '$orderItems.product',
					quantitySold: {$sum: '$orderItems.quantity'},
					totalRevenue: {$sum: '$orderItems.price'}
				}
			},
			//  $lookup aggregation pipeline to join the orderItems with the products collection based on the product ID.
			// ? Note that you'll need to adjust the from, localField, foreignField, and as options in the $lookup stage to match the name of your products collection and the field names that contain the product ID in your Order model and your Product model. You may also need to adjust the $project stage to include additional or different fields from the products collection depending on your needs
			{
				$lookup: {
					from: 'products',
					localField: '_id',
					foreignField: '_id',
					as: 'productInfo'
				}
			},
			{
				$project: {
					_id: 0,
					productId: '$_id',
					quantitySold: 1,
					totalRevenue: 1,
					name: {$arrayElemAt: ['$productInfo.name', 0]},
					image: {$arrayElemAt: ['$productInfo.photos', 0]},
					category: {$arrayElemAt: ['$productInfo.category', 0]}
				}
			},
			// sort the groups by quantity sold in descending order using $sort and limit the results to the top 10 using $limit
			{$sort: {quantitySold: -1}},
			{$limit: 10}
		]);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform get top selling products operation',
			error,
			'getTopSellingProducts'
		);
	}
}

// Admin services
export async function addProduct(data: IProductDocument) {
	try {
		return Product.create(data);
	} catch (error: any) {
		throw new BaseError('Could not perform add product operation', error, 'addProduct');
	}
}
