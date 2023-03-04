import {Router} from 'express';
import {isLoggedIn} from '../../middlewares';
import {
	sendRazorpayKey,
	sendStripeKey,
	captureRazorpayPayment,
	captureStripePayment,
	verifyRazorpayPayment
} from './payment.controller';

const router = Router();

router.route('/stripekey').get(isLoggedIn, sendStripeKey);
router.route('/razorpaykey').get(isLoggedIn, sendRazorpayKey);

router.route('/capturestripepayment').post(isLoggedIn, captureStripePayment);
router.route('/capturerazorpaypayment').post(isLoggedIn, captureRazorpayPayment);

router.route('/payment/verification').post(isLoggedIn, verifyRazorpayPayment);

export default router;
