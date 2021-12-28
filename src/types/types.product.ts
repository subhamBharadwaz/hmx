/* eslint-disable no-unused-vars */
import {Document, Types} from 'mongoose';

export enum CategoryType {
	Men = 'Men',
	Women = 'Women'
}

export enum ProductType {
	Twill = 'Twill Jogger',
	Shirred = 'Shirred Leg Jogger',
	Moto = 'Moto Knit Jogger',
	Drop = 'Drop Crotch Jogger',
	HipHop = 'Hip Hop Jogger',
	Shading = 'Shading Block Jogger',
	Chino = 'Chino Jogger',
	Handcuffed = 'Handcuffed Jogger',
	Loose = 'Loose Pocket Jogger',
	Splash = 'Splash-color Jogger',
	Wool = 'Wool Jogger',
	Tore = 'Distressed Jogger',
	NonCuffed = 'Non Cuffed Jogger'
}

export enum SizeType {
	Small = 'S',
	Medium = 'M',
	Large = 'L',
	ExtraLarge = 'XL',
	DoubleExtraLarge = 'XXL'
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
	price: number;
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
