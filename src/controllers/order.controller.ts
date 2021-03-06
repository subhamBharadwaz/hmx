/* eslint-disable import/prefer-default-export */
import {Request, Response, NextFunction} from 'express';
import Order from '@model/order.model';
import Product from '@model/product.model';
import {BigPromise} from '@middleware/index';
import {IOrderDocument} from '@type/types.order';
import {IGetUserAuthInfoRequest} from '@type/types.user';
import {isValidMongooseObjectId, CustomError, logger} from '@util/index';

let logErr: CustomError;

/** 
@desc    Create Order
@route   POST /api/v1/order
@access  Private
*/
export const createOrder = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const {
			shippingInfo,
			orderItems,
			paymentInfo,
			taxAmount,
			shippingAmount,
			totalAmount,
			orderStatus
		}: IOrderDocument = req.body;

		if (
			!shippingInfo ||
			!orderItems ||
			!paymentInfo ||
			!taxAmount ||
			!shippingAmount ||
			!totalAmount
		) {
			logErr = new CustomError(`All required fields must be filled`, 401);
			logger.error(logErr);
			return next(logErr);
		}

		const userId = req.user._id;
		isValidMongooseObjectId(userId, next);

		const order = await Order.create({
			shippingInfo,
			orderItems,
			paymentInfo,
			taxAmount,
			shippingAmount,
			totalAmount,
			orderStatus,
			user: userId
		} as IOrderDocument);

		res.status(200).json({
			success: true,
			order
		});
	}
);

/** 
@desc    Get Single Order
@route   GET /api/v1/order/id
@access  Private
*/
export const getSingleOrder = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);
		const order = await Order.findById(orderId).populate('user', 'name email');

		if (!order) {
			logErr = new CustomError(`Please check order id`, 401);
			logger.error(logErr);
			return next(logErr);
		}
		res.status(200).json({success: true, order});
	}
);

/** 
@desc    Get logged in user Orders
@route   GET /api/v1/order/id
@access  Private
*/
export const getLoggedInUserOrders = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const userId = req.user._id;
		isValidMongooseObjectId(userId, next);

		const order = await Order.find({user: userId});

		if (!order) {
			logErr = new CustomError(`Please check order id`, 401);
			logger.error(logErr);
			return next(logErr);
		}
		res.status(200).json({success: true, order});
	}
);

/** 
@desc    Get all orders - Admin only
@route   GET /api/v1/order/id
@access  Private
*/
export const adminGetAllOrders = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const orders = await Order.find();

	res.status(200).json({success: true, orders});
});

/** 
@desc    Update single order - Admin only
@route   PUT /api/v1/order/id
@access  Private
*/
export const adminUpdateSingleOrder = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);

		const order = await Order.findById(orderId);

		if (order?.orderStatus === 'Delivered') {
			logErr = new CustomError(`Order is already marked for delivered`, 401);
			logger.error(logErr);
			return next(logErr);
		}

		// update the order status
		if (order !== null) {
			order.orderStatus = req.body.orderStatus;
		}

		// update product stock before saving
		order?.orderItems.forEach(async prod => {
			await updateProductStock(prod.product, prod.quantity);
		});

		await order?.save();
		res.status(200).json({success: true, order});
	}
);

/** 
@desc    Delete single order - Admin only
@route   DELETE /api/v1/order/id
@access  Private
*/
export const adminDeleteSingleOrder = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);

		const order = await Order.findById(orderId);

		if (!order) {
			logErr = new CustomError(`Order is not found with the id ${orderId}`, 400);
			logger.error(logErr);
			return next(logErr);
		}

		await order.remove();

		res.status(201).json({success: true, message: 'Order is successfully deleted'});
	}
);

// Update product stock
// TODO find the correct type for productId, the ObjectId  or the Schema.Types.ObjectId is not working as of now
async function updateProductStock(productId: any, quantity: number) {
	const product = await Product.findById(productId);

	// TODO  check - While placing the order, fist check whether the product is actually in stock or not

	if (product !== null) {
		product.stock -= quantity;
	}

	await product?.save({validateBeforeSave: false});
}
