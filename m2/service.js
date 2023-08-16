const winston = require('winston');
const amqp = require('amqplib')

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
        new winston.transports.File({ filename: 'm2.log' }),
    ],
});

const processTask = async (task) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {result: `Processsed: ${task}`};
}

const startConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://127.0.0.1');
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, {durable: true});
        channel.prefetch(1);

        console.log('M2 microservice waiting for tasks...');

        channel.consume(QUEUE_NAME, async (msg) => {
            const task = JSON.parse(msg.content.toString());

            logger.info(`Received task: ${JSON.stringify(task)}`);

            console.log('Task received', task);

            const result = await processTask(task);

            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from(JSON.stringify(result)), 
                {correlationId: msg.properties.correlationId}
            );

            channel.ack(msg);
        });
    } catch (error) {
        console.error(error);
        logger.error(`Error in M2 microservice: ${error}`);
    }
}

startConsumer();