/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export enum CategoryType {
	Men = 'men',
	Women = 'women',
	Unisex = 'unisex'
}

export enum ProductType {
	Twill = 'twilljogger',
	Shirred = 'shirredlegjogger',
	Moto = 'motoknitjogger',
	Drop = 'dropcrotchjogger',
	HipHop = 'hiphopjogger',
	Shading = 'shadingblockjogger',
	Chino = 'chinojogger',
	Handcuffed = 'handcuffedjogger',
	Loose = 'loosepocketjogger',
	Splash = 'splashcolorjogger',
	Wool = 'wooljogger',
	Tore = 'distressedjogger',
	NonCuffed = 'noncuffedjogger'
}

export enum SizeType {
	Small = 's',
	Medium = 'm',
	Large = 'l',
	ExtraLarge = 'xl',
	DoubleExtraLarge = 'xxl'
}

export enum RatingType {
	One = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5
}

export interface IProductDocument extends Document {
	name: string;
	price: string;
	description: string;
	photos: [
		{
			id: string;
			secure_url: string;
		}
	];
	category: CategoryType;
	productType: ProductType;
	brand: string;
	stock: number;
	size: SizeType;
	ratings: RatingType;
	numberOfReviews: number;
	reviews: [
		{
			user: Types.ObjectId;
			name: string;
			rating: number;
			comment: string;
		}
	];
	user: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}
