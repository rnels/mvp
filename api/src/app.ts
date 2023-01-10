import express from 'express';
import cors from 'cors';
import compression from 'compression';

import router from './routes';

const app = express();
app.use(compression());
app.use(express.json());
app.use(cors());
app.use(router);

export default app;
