import express from 'express';
import router from './routes/mainRoute';
import appMiddleware from './middlewares/appMiddleware';
import ErrorHandler from './middlewares/errHandler';
import 'dotenv/config';
import cors from 'cors';
import { corsOptions } from '../app.config';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.json());
app.use(appMiddleware);

app.use('/api', router);
app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on: http://${host}:${port}/api/`);
});
