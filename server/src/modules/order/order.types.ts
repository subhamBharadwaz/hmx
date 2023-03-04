/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export enum OrderStatusType {
	Processing = 'Processing',
	Shipped = 'Shipped',
	OutForDelivery = 'Out for delivery',
	Delivered = 'Delivered'
}

export interface IOrderDocument extends Document {
	user: Types.ObjectId;

	shippingInfo: {
		firstName: string;
		lastName: string;
		houseNo: string;
		streetName: string;
		landMark: string;
		postalCode: string;
		city: string;
		country: string;
		state: string;
		phoneNumber: string;
	};

	orderItems: {
		name: string;
		size: string;
		quantity: number;
		image: string;
		price: number;
		product: Types.ObjectId;
	}[];
	deliveredAt: Date;
	orderStatus: OrderStatusType;
	paymentInfo: {
		id: string;
	};

	taxAmount: number;
	shippingAmount: number;
	totalAmount: number;
	createdAt: Date;
}
