import dotenv from 'dotenv';
import app from './app';
import {connectToDB} from './config/db';

dotenv.config();

connectToDB();

const {PORT} = process.env;

app.listen(4000, () => console.log(`Server is running at http://localhost:${PORT}`));
