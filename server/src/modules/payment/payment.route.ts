import {Router} from 'express';
import {isLoggedIn} from '../../middlewares';
import {
	sendRazorpayKey,
	sendStripeKey,
	captureRazorpayPayment,
	captureStripePayment
} from './payment.controller';

const router = Router();

router.route('/stripekey').get(isLoggedIn, sendStripeKey);
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKey);

router.route('/capturestripepayment').get(isLoggedIn, captureStripePayment);
router.route('/capturerazorpaypayment').get(isLoggedIn, captureRazorpayPayment);

export default router;
