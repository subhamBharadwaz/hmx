/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/prefer-default-export */
/* eslint-disable security/detect-object-injection */
import {Response, NextFunction} from 'express';
import {BigPromise} from '../../middlewares';
import {APIError} from '../../utils';
import {IGetUserAuthInfoRequest} from '../user/user.types';
import {HttpStatusCode} from '../../types/http.model';

import Wishlist from './wishlist.model';
import {findOneProduct} from '../product/product.service';
import {findWishlistForSingleUser} from './wishlist.service';

/**
@desc    Get Wishlist
@route   GET /api/v1/wishlist
@access  Private
*/

export const getWishlistHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response) => {
		const user = req.user._id;

		const wishlist = await findWishlistForSingleUser(user);

		if (wishlist && wishlist.products.length > 0) {
			res.status(200).send(wishlist);
		} else {
			res.send(null);
		}
	}
);

/**
@desc    Create Wishlist
@route   PUT /api/v1/wishlist
@access  Private
*/

export const createWishlistHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = req.user._id;

		const {productId} = req.body;

		const wishlist = await findWishlistForSingleUser(user);

		const product = await findOneProduct(productId);

		if (!product) {
			const message = 'No product found, please correct the data and try again.';
			return next(new APIError(message, 'createWishlistHandler', HttpStatusCode.NOT_FOUND));
		}

		const {price, name, photos, size, category} = product;

		// If wishlist already exists for user

		if (wishlist) {
			// eslint-disable-next-line eqeqeq
			const productIndex = wishlist.products.findIndex(p => p.productId == productId);

			// Check if product exists or not
			if (productIndex > -1) {
				const product = wishlist.products[productIndex];

				wishlist.products[productIndex] = product;
				await wishlist.save();
				res.status(200).send(wishlist);
			} else {
				wishlist.products.push({
					productId,
					name,
					photos,
					size,
					category,
					price: Number(price)
				});
				await wishlist.save();
				res.status(200).send(wishlist);
			}
		} else {
			// no wishlist exists, create one
			const newWishlist = await Wishlist.create({
				user,
				products: [{productId, name, photos, size, category, price}]
			});
			res.status(200).send(newWishlist);
		}
	}
);

/**
@desc    Delete Wishlist item
@route   DELETE /api/v1/wishlist/id
@access  Private
*/

export const deleteWIshlistHandler = BigPromise(
	async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
		const user = req.user._id;

		const {productId} = req.params;

		let wishlist = await findWishlistForSingleUser(user);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		// eslint-disable-next-line eqeqeq
		const productIndex = wishlist!.products.findIndex(p => p.productId == productId);

		if (productIndex > -1) {
			wishlist!.products.splice(productIndex, 1);
			wishlist = await wishlist!.save();
			res.status(200).send(wishlist);
		} else {
			const message = 'Product Not Found.';

			return next(new APIError(message, 'deleteWIshlistHandler', HttpStatusCode.NOT_FOUND));
		}
	}
);
