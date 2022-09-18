/* eslint-disable func-names */
import {Schema, model} from 'mongoose';
import {IProductDocument, CategoryType, ProductType, SizeType, RatingType} from './product.types';

const ProductSchema = new Schema<IProductDocument>(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name of the product'],
			trim: true
		},
		price: {
			type: String,
			required: [true, 'Please provide price of the product']
		},
		description: {
			type: String,
			required: [true, 'Please provide a description of the product']
		},
		photos: [
			{
				id: {
					type: String,
					required: true
				},
				secure_url: {
					type: String,
					required: true
				}
			}
		],
		category: {
			type: String,
			required: [true, 'Please select a category for the product'],
			enum: {
				values: Object.values(CategoryType),
				message: `Please select category only from - ${CategoryType.Men} or ${CategoryType.Women}`
			}
		},
		productType: {
			type: String,
			required: [true, 'Please select type of the product'],
			enum: {
				values: Object.values(ProductType),
				message: `Please select the type of the product only from the given types`
			}
		},
		brand: {
			type: String,
			required: [true, 'Please ad a brand for the product']
		},
		stock: {
			type: Number,
			default: 0
		},
		size: {
			type: String,
			required: [true, 'Please select the available sizes for the product'],
			enum: {
				values: Object.values(SizeType),
				message: `Please select sized only from the given sizes,`
			}
		},
		ratings: {
			type: Number,
			default: 0
		},
		numberOfReviews: {
			type: Number,
			default: 0
		},
		reviews: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true
				},
				name: {
					type: String
				},
				rating: {
					type: Number,
					required: true,
					enum: {
						values: Object.values(RatingType),
						message: `Please select rating only from 0-5`
					}
				},
				comment: {
					type: String,
					required: true
				}
			}
		],
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{
		timestamps: true
	}
);

const ProductModel = model<IProductDocument>('Product', ProductSchema);

export default ProductModel;
