/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/prefer-default-export */
/* eslint-disable security/detect-object-injection */
import {Response, NextFunction} from 'express';
import {BigPromise} from '../../middlewares';
import {APIError} from '../../utils';
import {IGetUserAuthInfoRequest} from '../user/user.types';
import {HttpStatusCode} from '../../types/http.model';

import Bag from './bag.model';
import {findOneProduct} from '../product/product.service';
import {findBagForSingleUser} from './bag.service';

/**
@desc    Get Bag
@route   GET /api/v1/bag
@access  Private
*/

export const getBagHandler = BigPromise(async (req: IGetUserAuthInfoRequest, res: Response) => {
	const user = req.user._id;

	const bag = await findBagForSingleUser(user);

	if (bag && bag.products.length > 0) {
		res.status(200).send(bag);
	} else {
		res.send(null);
	}
});

/**
@desc    Create Bag
@route   PUT /api/v1/bag
@access  Private
*/

export const createBagHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = req.user._id;

		const {productId, size, quantity} = req.body;

		const bag = await findBagForSingleUser(user);

		const product = await findOneProduct(productId);

		if (!product) {
			const message = 'No product found, please correct the data and try again.';
			return next(new APIError(message, 'createBagHandler', HttpStatusCode.NOT_FOUND));
		}

		const {price, name, photos} = product;

		// If bag already exists for user

		if (bag) {
			// eslint-disable-next-line eqeqeq
			const productIndex = bag.products.findIndex(p => p.productId == productId);

			// Check if product exists or not
			if (productIndex > -1) {
				const product = bag.products[productIndex];
				product.quantity = quantity;
				product.size = size;
				bag.totalPrice = bag.products.reduce((acc, curr) => {
					return acc + curr.quantity * curr.price;
				}, 0);

				bag.products[productIndex] = product;
				await bag.save();
				res.status(200).send(bag);
			} else {
				bag.products.push({productId, name, size, photos, quantity, price: Number(price)});
				bag.totalPrice = bag.products.reduce((acc, curr) => {
					return acc + curr.quantity * curr.price;
				}, 0);

				await bag.save();
				res.status(200).send(bag);
			}
		} else {
			// no bag exists, create one
			const newBag = await Bag.create({
				user,
				products: [{productId, name, size, photos, quantity, price}],
				totalPrice: quantity * Number(price)
			});
			res.status(200).send(newBag);
		}
	}
);

/**
@desc    Delete Product in Bag
@route   DELETE /api/v1/bag
@access  Private
*/

export const deleteBagProductHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = req.user._id;

		const {productId} = req.params;
		console.log(productId);
		let bag = await findBagForSingleUser(user);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line eqeqeq
		const productIndex = bag!.products.findIndex(p => p.productId == productId);

		if (productIndex > -1) {
			const product = bag?.products[productIndex];
			bag!.totalPrice -= product!.quantity * product!.price;
			if (bag!.totalPrice < 0) {
				bag!.totalPrice = 0;
			}
			bag!.products.splice(productIndex, 1);
			bag!.totalPrice = bag!.products.reduce((acc, curr) => {
				return acc + curr.quantity * curr.price;
			}, 0);
			bag = await bag!.save();

			res.status(200).send(bag);
		} else {
			const message = 'Product Not Found.';

			return next(new APIError(message, 'deleteBagProductHandler', HttpStatusCode.NOT_FOUND));
		}
	}
);
