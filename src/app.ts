import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import expressPinoLogger from 'express-pino-logger';
import logger from './utils/logger';

// import routes
import user from './routes/user.route';

dotenv.config();
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

// router middleware
app.use('/api/v1', user);

// handle unhandled promise rejections
// eslint-disable-next-line no-unused-vars
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
	throw reason;
});

// handle uncaught exceptions
process.on('uncaughtException', err => {
	logger.error('There was an uncaught error', err);
	process.exit(1);
});

export default app;
