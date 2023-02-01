import {Schema, model} from 'mongoose';
import {IBagDocument} from './bag.types';

const BagSchema = new Schema<IBagDocument>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		products: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				name: String,
				quantity: {
					type: Number,
					required: true,
					min: 1,
					default: 1
				},
				price: Number
			}
		],
		totalPrice: {
			type: Number,
			required: true,
			default: 0
		}
	},
	{timestamps: true}
);

const BagModel = model<IBagDocument>('Bag', BagSchema);

export default BagModel;
