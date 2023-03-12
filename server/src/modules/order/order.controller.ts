import {Request, Response, NextFunction} from 'express';
import Product from '../product/product.model';
import {BigPromise} from '../../middlewares';
import {IOrderDocument, OrderStatusType} from './order.types';
import {IGetUserAuthInfoRequest} from '../user/user.types';
import {HttpStatusCode} from '../../types/http.model';
import {isValidMongooseObjectId, APIError} from '../../utils';
import {
	createOrder,
	findOrderByIdAndPopulate,
	findLoggedInUserOrders,
	findAllOrders,
	findOrderById
} from './order.service';

/** 
@desc    Create Order
@route   POST /api/v1/order
@access  Private
*/
export const createOrderHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const orderStatus = OrderStatusType.Processing;
		const {
			shippingInfo,
			orderItems,
			paymentInfo,
			taxAmount,
			shippingAmount,
			totalAmount
		}: IOrderDocument = req.body;

		// if (
		// 	!shippingInfo ||
		// 	!orderItems ||
		// 	!paymentInfo ||
		// 	!taxAmount ||
		// 	!shippingAmount ||
		// 	!totalAmount
		// ) {
		// 	const message = 'Required fields must be filled';
		// 	return next(new APIError(message, 'createOrderHandler', HttpStatusCode.BAD_REQUEST));
		// }

		const userId = req.user._id;
		isValidMongooseObjectId(userId, next);

		const order = await createOrder({
			shippingInfo,
			orderItems,
			taxAmount,
			paymentInfo,
			shippingAmount,
			orderStatus,
			totalAmount,
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
export const getSingleOrderHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);
		const order = await findOrderByIdAndPopulate(orderId, 'firstName lastName email');

		if (!order) {
			const message = 'Please check your order ID';
			return next(new APIError(message, 'getSingleOrderHandler', HttpStatusCode.BAD_REQUEST));
		}
		res.status(200).json({success: true, order});
	}
);

/** 
@desc    Get logged in user Orders
@route   GET /api/v1/order/id
@access  Private
*/
export const getLoggedInUserOrdersHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const userId = req.user._id;
		isValidMongooseObjectId(userId, next);

		const orders = await findLoggedInUserOrders(userId);

		if (!orders) {
			const message = 'Please check your order ID';
			return next(
				new APIError(message, 'getLoggedInUserOrdersHandler', HttpStatusCode.BAD_REQUEST)
			);
		}
		res.status(200).json({success: true, orders});
	}
);

/** 
@desc    Get all orders - Admin only
@route   GET /api/v1/order/id
@access  Private
*/
export const adminGetAllOrdersHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response) => {
		const orders = await findAllOrders();

		res.status(200).json({success: true, orders});
	}
);

/** 
@desc     Get single order - Admin only
@route   GET /api/v1/order/id
@access  Private
*/
export const adminGetSingleOrderHandler = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);
		const order = await findOrderByIdAndPopulate(orderId, 'firstName lastName email');

		if (!order) {
			const message = 'Please check your order ID';
			return next(new APIError(message, 'getSingleOrderHandler', HttpStatusCode.BAD_REQUEST));
		}
		res.status(200).json({success: true, order});
	}
);

/** 
@desc    Update single order - Admin only
@route   PUT /api/v1/order/id
@access  Private
*/
export const adminUpdateSingleOrderHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);

		const order = await findOrderById(orderId);

		if (order?.orderStatus === 'Delivered') {
			const message = 'Order is already marked for delivered';
			return next(
				new APIError(
					message,
					'adminUpdateSingleOrderHandler',
					HttpStatusCode.ALREADY_EXISTS
				)
			);
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
export const adminDeleteSingleOrderHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const orderId = req.params.id;
		isValidMongooseObjectId(orderId, next);

		const order = await findOrderById(orderId);

		if (!order) {
			const message = 'Order not found';
			return next(
				new APIError(message, 'adminDeleteSingleOrderHandler', HttpStatusCode.NOT_FOUND)
			);
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
