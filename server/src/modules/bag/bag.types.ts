/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export interface IBagDocument extends Document {
	user: Types.ObjectId;
	products: {
		productId: Types.ObjectId;
		quantity: number;
		name: string;
		price: number;
	}[];
	totalPrice: number;
	createdAt: Date;
	updatedAt: Date;
}
