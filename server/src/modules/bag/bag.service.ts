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
