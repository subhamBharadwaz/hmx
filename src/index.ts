import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import {v2 as cloudinary} from 'cloudinary';
import app from './app';
import {connectToDB} from './utils/db';
import logger from './utils/logger';

// connect to database
connectToDB();

// cloudinary config
cloudinary.config({
	cloud_name: config.get<string>('cloudinaryName'),
	api_key: config.get<string>('cloudinaryApiKey'),
	api_secret: config.get<string>('cloudinaryApiSecret')
});

const PORT = config.get<number>('port');

app.listen(4000, () => logger.info(`Server is running at http://localhost:${PORT}`));
