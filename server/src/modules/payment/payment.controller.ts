/* eslint-disable camelcase */
import crypto from 'crypto';
import {Request, Response, NextFunction} from 'express';
import config from 'config';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import {nanoid} from 'nanoid';
import {BigPromise} from '../../middlewares';
import {APIError} from '../../utils';
import {HttpStatusCode} from '../../types/http.model';

const stripe = new Stripe(config.get<string>('stripeApiSecret'), {apiVersion: '2020-08-27'});

export const sendStripeKey = BigPromise(async (req: Request, res: Response) => {
	res.status(200).json({
		stripeApiKey: config.get<string>('stripeApiKey')
	});
});

export const captureStripePayment = BigPromise(async (req: Request, res: Response) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: req.body.amount,
		currency: 'inr',

		// optional
		metadata: {integration_check: 'accept_a_payment'}
	});

	res.status(200).json({
		success: true,
		client_secret: paymentIntent.client_secret,
		id: nanoid()
	});
});

export const sendRazorpayKey = BigPromise(async (req: Request, res: Response) => {
	res.status(200).json({
		razorpayApiKey: config.get<string>('razorpayApiKey')
	});
});

export const captureRazorpayPayment = BigPromise(async (req: Request, res: Response) => {
	const instance = new Razorpay({
		key_id: config.get<string>('razorpayApiKey'),
		key_secret: config.get<string>('razorpayApiSecret')
	});

	const options = {
		amount: req.body.amount * 100,
		currency: 'INR',
		receipt: `receipt#${nanoid()}`
	};
	const myOrder = await instance.orders.create(options);

	res.status(200).json({
		success: true,
		amount: req.body.amount,
		order: myOrder
	});
});

export const verifyRazorpayPayment = BigPromise(
	async (req: Request, res: Response, next: NextFunction) => {
		const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

		const body = `${razorpay_order_id}|${razorpay_payment_id}`;

		const expectedSignature = crypto
			.createHmac('sha256', config.get<string>('razorpayApiSecret'))
			.update(body.toString())
			.digest('hex');

		const isAuthentic = expectedSignature === razorpay_signature;

		if (isAuthentic) {
			//  database comes here
			res.status(200).json({
				success: true,
				message: 'Your order has been placed successfully'
			});
		} else {
			const message = 'Not a legit payment';
			return next(new APIError(message, 'verifyRazorpayPayment', HttpStatusCode.BAD_REQUEST));
		}
	}
);
