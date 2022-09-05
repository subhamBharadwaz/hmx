/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export enum OrderStatusType {
	Processing = 'Processing',
	Shipped = 'Shipped',
	OutForDelivery = 'Out for delivery',
	Delivered = 'Delivered'
}

export interface IOrderDocument extends Document {
	shippingInfo: {
		address: string;
		city: string;
		phoneNo: string;
		postalCode: string;
		state: string;
		country: string;
	};
	user: Types.ObjectId;
	orderItems: {
		name: string;
		quantity: number;
		image: string;
		price: number;
		product: Types.ObjectId;
	}[];
	paymentInfo: {
		id: string;
	};
	taxAmount: number;
	shippingAmount: number;
	totalAmount: number;
	orderStatus: OrderStatusType;
	deliveredAt: Date;
	createdAt: Date;
}
