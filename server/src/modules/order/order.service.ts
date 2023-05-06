import Order from './order.model';
import {BaseError} from '../../utils';
import {IOrderDocument} from './order.types';

export async function createOrder(data: IOrderDocument) {
	try {
		return Order.create(data);
	} catch (error: any) {
		throw new BaseError('Could not perform create user operation', error, 'createOrder');
	}
}

export async function findOrderByIdAndPopulate(id: string, data: string) {
	try {
		return Order.findById(id).populate('user', data);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find order by ID operation',
			error,
			'findOrderByIdAndPopulate'
		);
	}
}

export async function findLoggedInUserOrders(id: string) {
	try {
		return Order.find({user: id});
	} catch (error: any) {
		throw new BaseError(
			"Could not perform find logged in user's orders operation",
			error,
			'findLoggedInUserOrders'
		);
	}
}

// Admin services
export async function findAllOrders() {
	try {
		return Order.find();
	} catch (error: any) {
		throw new BaseError('Could not perform find all orders operation', error, 'findAllOrders');
	}
}

export async function totalOrders() {
	try {
		const orders = await Order.countDocuments();
		return orders;
	} catch (error: any) {
		throw new BaseError('Could not perform find total orders operation', error, 'totalOrders');
	}
}

export async function findRecentOrders() {
	try {
		const recentOrders = await Order.find({}).sort({createdAt: -1}).limit(5);
		return recentOrders;
	} catch (error: any) {
		throw new BaseError('Could not perform find all orders operation', error, 'findAllOrders');
	}
}

export async function totalDeliveredOrders() {
	try {
		const orders = await Order.countDocuments({orderStatus: 'Delivered'});
		return orders;
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find total delivered orders operation',
			error,
			'totalDeliveredOrders'
		);
	}
}

export async function findOrderById(id: string) {
	try {
		return Order.findById(id);
	} catch (error: any) {
		throw new BaseError('Could not perform find order by ID operation', error, 'findOrderById');
	}
}
