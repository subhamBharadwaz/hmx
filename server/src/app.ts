/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';

// import routes
import user from './modules/user/user.route';
import product from './modules/product/product.route';
import payment from './modules/payment/payment.route';
import order from './modules/order/order.route';

const app = express();

// swagger docs
const swaggerDocument = YAML.load(`${__dirname}/swagger.yaml`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cookies and file middleware
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/temp/'
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

export default app;
