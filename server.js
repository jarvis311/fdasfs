import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router/router.js';
import fileUpload from "express-fileupload"

import redisClient from './config/redis.js';

const app = express();
dotenv.config()
// COrs Origin
app.use(cors());
app.use(fileUpload())
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// all routes 
app.use('/api', router)

app.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});