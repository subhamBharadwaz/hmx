import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

dotenv.config();
const app = express();

// swagger docs
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// morgan middleware
app.use(morgan('tiny'));

export default app;
