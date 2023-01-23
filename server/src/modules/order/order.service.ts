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

export async function findOrderByIdAndPopulate(id: string, ...data: string[]) {
	try {
		return Order.findById(id).populate(data);
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

export async function findOrderById(id: string) {
	try {
		return Order.findById(id);
	} catch (error: any) {
		throw new BaseError('Could not perform find order by ID operation', error, 'findOrderById');
	}
}
