/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import express, {Request, Response, NextFunction} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';

import {BaseError, logger, ErrorHandler} from './utils/index';
import {HttpStatusCode} from './types/http.model';
// import routes
import user from './modules/user/user.route';
import product from './modules/product/product.route';
import payment from './modules/payment/payment.route';
import order from './modules/order/order.route';

const app = express();

// swagger docs
const swaggerDocument = YAML.load(`${__dirname}/swagger.yaml`);
const errorHandler = new ErrorHandler(logger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// cors
app.use(
	cors({
		origin: config.get<string>('origin'),
		credentials: true
	})
);

// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies and file middleware
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/'
	})
);

// set security headers
app.use(helmet());

// TODO rate limit
// TODO Support blacklisting JWTs
// TODO Modify the default session middleware settings

// router middleware
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', payment);
app.use('/api/v1', order);

// Handling errors
app.use(errorMiddleware);

process.on('uncaughtException', async (error: Error) => {
	await errorHandler.handleError(error);
	if (!errorHandler.isTrustedError(error)) process.exit(1);
});

process.on('unhandledRejection', (reason: Error) => {
	throw reason;
});

async function errorMiddleware(err: BaseError, req: Request, res: Response, next: NextFunction) {
	if (!errorHandler.isTrustedError(err)) {
		res.json({
			error: 'Something went wrong, please try again later.',
			code: HttpStatusCode.INTERNAL_SERVER
		});
		next(err);
		return;
	}
	await errorHandler.handleError(err);
	res.json({error: err.message, code: err.httpCode});
}

export default app;
