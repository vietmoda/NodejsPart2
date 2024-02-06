// const express = require('express')
import express from 'express'
import { engine } from 'express-handlebars'
import routes from './routes/index.js'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(express.static('src/public')); //cấu hình nơi chứa static file
app.use(express.json()) //giúp xử lí dl json gửi đến từ các yêu cầu http

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

mongoose.connect(process.env.MONGO_DB)
.then(() =>{
    console.log('connect db thanh cong')
})
.catch((err) =>{
    console.log(err);
})

const port = process.env.PORT

routes(app)

app.listen(port, () => {
    console.log('server is running in port: ', port);
})

