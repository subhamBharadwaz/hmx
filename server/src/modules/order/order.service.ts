import Order from './order.model';
import {logger} from '../../utils';
import {IOrderDocument} from './order.types';

export async function createOrder(data: IOrderDocument) {
	try {
		return Order.create(data);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findOrderByIdAndPopulate(id: string, ...data: string[]) {
	try {
		return Order.findById(id).populate(data);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findLoggedInUserOrders(id: string) {
	try {
		return Order.find({user: id});
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

// Admin services
export async function findAllOrders() {
	try {
		return Order.find();
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findOrderById(id: string) {
	try {
		return Order.findById(id);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}
