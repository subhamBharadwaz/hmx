/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export interface IWishlistDocument extends Document {
	user: Types.ObjectId;
	products: {
		productId: Types.ObjectId;
		name: string;
		price: number;
		photos: {
			id: string;
			secure_url: string;
		}[];
		size: string[];
		category: string;
	}[];

	createdAt: Date;
	updatedAt: Date;
}
