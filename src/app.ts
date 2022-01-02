/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import expressPinoLogger from 'express-pino-logger';
import helmet from 'helmet';
import {logger} from '@util/index';

// import routes
import user from './routes/user.route';
import product from './routes/product.route';

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

// logger middleware
app.use(
	expressPinoLogger({
		logger,
		serializers: {
			req: req => ({
				method: req.method,
				url: req.url,
				user: req.raw.user
			})
		}
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

// handle unhandled promise rejections

process.on('unhandledRejection', (reason: string) => {
	throw reason;
});

// handle uncaught exceptions
process.on('uncaughtException', err => {
	logger.error('There was an uncaught error', err);
	process.exit(1);
});

export default app;
