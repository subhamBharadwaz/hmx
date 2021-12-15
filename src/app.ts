import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

dotenv.config();
const app = express();

// swagger docs
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
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
app.use(morgan('tiny'));

// import routes
import user from './routes/user.route';

// router middleware
app.use('/api/v1', user);

export default app;
