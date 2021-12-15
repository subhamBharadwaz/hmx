import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import app from './app';
import {connectToDB} from './config/db';

dotenv.config();

// connect to database
connectToDB();

// cloudinary config
cloudinary.config({
	cloud_name: `${process.env.CLOUDINARY_NAME}`,
	api_key: `${process.env.CLOUDINARY_API_KEY}`,
	api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});

const {PORT} = process.env;

app.listen(4000, () => console.log(`Server is running at http://localhost:${PORT}`));
