const express = require('express');
const winston = require('winston');
const amqp = require('amqplib');

const app = express();
const port = 3000;
const hostname = '127.0.0.1';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'm1.log' }),
    ],
});

app.use(express.json());

app.get('/m1', async (req, res) => {
    res.send('Microservice 1: service that sends the tasks')
})

app.listen(port, hostname, ()=>{
    console.log(`m1 running at http://${hostname}:${port}/`)
})
