import {Schema, model} from 'mongoose';
import {IOrderDocument, OrderStatusType} from './order.types';

const OrderSchema = new Schema<IOrderDocument>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},

		shippingInfo: {
			firstName: {
				type: String,
				required: true
			},
			lastName: {
				type: String,
				required: true
			},
			houseNo: {
				type: String,
				required: true
			},
			streetName: {
				type: String,
				required: true
			},
			landMark: {
				type: String,
				required: true
			},
			city: {
				type: String,
				required: true
			},
			postalCode: {
				type: String,
				required: true
			},
			country: {
				type: String,
				required: true
			},
			state: {
				type: String,
				required: true
			},
			phoneNumber: {
				type: String,
				required: true
			}
		},

		orderItems: [
			{
				name: {
					type: String,
					required: true
				},
				size: {
					type: String,
					require: true
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

		orderStatus: {
			type: String,
			enum: {
				values: Object.values(OrderStatusType)
			},
			default: OrderStatusType.Processing
		},
		deliveryDate: {
			type: Date,
			default: () => {
				const date = new Date();
				date.setDate(date.getDate() + 7); // Set the delivery date 7 days from today
				return date;
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
		}
	},
	{
		timestamps: true
	}
);

const OrderModel = model<IOrderDocument>('Order', OrderSchema);

export default OrderModel;
