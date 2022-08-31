import Product from './product.model';
import {logger} from '../../utils';
import {IProductDocument} from './product.types';

export async function totalProducts() {
	try {
		return Product.countDocuments();
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findProduct() {
	try {
		return Product.find();
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

// eslint-disable-next-line no-undef
export async function findProductById(id: unknown) {
	try {
		return Product.findById(id);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
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
		logger.error(error);
		throw new Error(error);
	}
}

// Admin services
export async function addProduct(data: IProductDocument) {
	try {
		return Product.create(data);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}
