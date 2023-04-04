import {Schema, model} from 'mongoose';
import {IWishlistDocument} from './wishlist.types';

const WishlistSchema = new Schema<IWishlistDocument>(
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

				photos: [
					{
						id: String,
						secure_url: String
					}
				],
				size: [{type: String}],

				price: Number,
				category: String
			}
		]
	},
	{timestamps: true}
);

const WishlistModel = model<IWishlistDocument>('Wishlist', WishlistSchema);

export default WishlistModel;
