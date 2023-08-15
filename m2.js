const express = require('express');
const winston = require('winston');
const amqp = require('amqplib');

const app = express();
const port = 3001;
const hostname = '127.0.0.1';

const logger = winston.createLogger({
    level: 'info', // Adjust as needed
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'm2.log' }), // Log to a file
    ],
});

app.use(express.json());

app.get('/m2', async (req, res) => {
    res.send('Microservice 2: service that receives tasks')
});

app.listen(port, hostname, ()=>{
    console.log(`M2 running at http://${hostname}:${port}/`)
});