/* eslint-disable func-names */
import {Schema, model} from 'mongoose';
import {IProductDocument, Gender, Category, RatingType} from './product.types';

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
		gender: {
			type: String,
			required: [true, 'Please select a category for the product'],
			enum: {
				values: Object.values(Gender),
				message: `Please select category only from - ${Gender.Men}, ${Gender.Women} or ${Gender.Unisex}`
			}
		},
		category: {
			type: String,
			required: [true, 'Please select type of the product'],
			enum: {
				values: Object.values(Category),
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
		size: [{type: String, required: [true, 'Please add the product size/sizes']}],
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
				userInfo: {
					firstName: {
						type: String,
						required: true
					},
					lastName: {
						type: String,
						required: true
					},
					email: {
						type: String,
						required: true
					},
					photo: {
						type: String,
						required: true
					}
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
				},
				date: {
					type: Date,
					required: true,
					default: Date.now
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
