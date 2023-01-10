import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(process.env.PORT);
console.log(`Server listening on port ${process.env.PORT}`);
