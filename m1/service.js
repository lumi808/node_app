const express = require('express');
const winston = require('winston');
const amqp = require('amqplib');

const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const QUEUE_NAME = 'task_queue';

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

app.post('/process', async (req, res)=>{
    try {
        const { requestData } = req.body;

        logger.info(`Received HTTP request: ${JSON.stringify(requestData)}`);

        const connection = await amqp.connect('amqp://127.0.0.1');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        channel.sendToQueue(
            QUEUE_NAME, 
            Buffer.from(JSON.stringify(requestData)), 
            {persistent: true}
        );

        res.status(202).json({message: 'Task Accepted'});
    } catch(error) {
        logger.error(`Error processing HTTP request: ${error}`);
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(port, hostname, ()=>{
    console.log(`m1 running at http://${hostname}:${port}/`)
})