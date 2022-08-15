import {Schema, model} from 'mongoose';
import {IOrderDocument, OrderStatusType} from '../types/types.order';

const OrderSchema = new Schema<IOrderDocument>(
	{
		shippingInfo: {
			address: {
				type: String,
				required: true
			},
			city: {
				type: String,
				required: true
			},
			phoneNo: {
				type: String,
				required: true
			},
			postalCode: {
				type: String,
				required: true
			},
			state: {
				type: String,
				required: true
			},
			country: {
				type: String,
				required: true
			}
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		orderItems: [
			{
				name: {
					type: String,
					required: true
				},
				quantity: {
					type: Number,
					required: true
				},
				image: {
					type: String,
					required: true
				},
				price: {
					type: Number,
					required: true
				},
				product: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				}
			}
		],
		paymentInfo: {
			id: {
				type: String
			}
		},
		taxAmount: {
			type: Number,
			required: true
		},
		shippingAmount: {
			type: Number,
			required: true
		},
		totalAmount: {
			type: Number,
			required: true
		},
		orderStatus: {
			type: String,
			required: true,
			enum: {
				values: Object.values(OrderStatusType)
			}
		},
		deliveredAt: {
			type: Date
		}
	},
	{
		timestamps: true
	}
);

const OrderModel = model<IOrderDocument>('Order', OrderSchema);

export default OrderModel;
