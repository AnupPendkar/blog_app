import express from 'express';
import router from './routes/mainRoute';
import appMiddleware from './middlewares/appMiddleware';
import ErrorHandler from './middlewares/errHandler';
import 'dotenv/config';
import cors from 'cors';
import { corsOptions } from '../app.config';
import morgan from 'morgan';
import bodyParser from 'body-parser'
import path from 'path';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use('', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({limit: '50mb'}));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(appMiddleware);


app.use('/api', router);
app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on: http://${host}:${port}/api/`);
});
