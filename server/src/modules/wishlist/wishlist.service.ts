/* eslint-disable import/prefer-default-export */
import Wishlist from './wishlist.model';

import {BaseError} from '../../utils';

export async function findWishlistForSingleUser(user: string) {
	try {
		return Wishlist.findOne({user});
	} catch (error: any) {
		throw new BaseError(
			'Could not perform find wishlist  for the logged in user operation',
			error,
			'findWishlistForSingleUser'
		);
	}
}
