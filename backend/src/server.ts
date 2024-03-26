import express from 'express';
import router from './routes/mainRoute';
import appMiddleware from './middlewares/appMiddleware';
import ErrorHandler from './middlewares/errHandler';
import 'dotenv/config';
import cors from 'cors';
import { corsOptions } from '../app.config';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import './config/auth';
import passport from 'passport';
import session from 'express-session';
// import { initCronJob } from './config/cron';

const app = express();
const port = +process.env.PORT || 8005;

app.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

// initCronJob();

app.use(
  session({
    secret: process.env.GOOGLE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(cors(corsOptions));

app.use('', express.static(path.join(__dirname, '../uploads')));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(appMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', router);
app.use(ErrorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
