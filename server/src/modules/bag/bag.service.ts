/* eslint-disable import/prefer-default-export */
import Bag from './bag.model';

import {BaseError} from '../../utils';

export async function findBagForSingleUser(user: string) {
	try {
		return Bag.findOne({user});
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find bag for the logged in user operation',
			error,
			'findBagForSingleUser'
		);
	}
}

// Empty bag
export async function emptyBag(bagId: string) {
	try {
		return Bag.findByIdAndDelete(bagId);
	} catch (error: any) {
		throw new BaseError(
			'Could not perform empty bag for the logged in user operation',
			error,
			'emptyBag'
		);
	}
}

// export async function createBag(
// 	user: string,
// 	products: {
// 		productId: string;
// 		name: string;
// 		size: string;
// 		photos: {id: string; secure_url: string}[];
// 		quantity: number;
// 		price: number;
// 	},
// 	totalPrice: number
// ) {
// 	try {
// 		return Bag.create({user, products, totalPrice});
// 	} catch (error: any) {
// 		throw new BaseError(
// 			'Could not perform  create bag for the logged in user operation',
// 			error,
// 			'createBag'
// 		);
// 	}
// }
