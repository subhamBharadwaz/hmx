import Product from './product.model';
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

// Admin services
export async function addProduct(data: IProductDocument) {
	try {
		return Product.create(data);
	} catch (error: any) {
		throw new BaseError('Could not perform add product operation', error, 'addProduct');
	}
}
