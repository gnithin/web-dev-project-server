import * as bodyParser from 'body-parser';
import ConfigConstants from './constants/config'
import { Server } from '@overnightjs/core';
import { UserController } from './controllers/userController';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { QuestionController } from './controllers/questionController';
import * as cors from 'cors';
import * as dotenv from 'dotenv';

// config
dotenv.config();
if (process.env.NODE_ENV === 'development') {
    dotenv.config({path: './.dev.env'});
}

// Setup controllers
const corsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
};

class ChowkServer extends Server {
    constructor() {
        // super(process.env.NODE_ENV === 'development');
        super(false);
        this.app.use(bodyParser.json());
        this.app.use(cors(corsOptions));

        super.addControllers(
            [
                new UserController(),
                new QuestionController(),
            ],
        );
    }

    public start(portNumber: number) {
        this.app.listen(portNumber);
    }
}

async function initializeServer() {
    let port: number;
    const portStr: string | undefined = process.env.PORT_NUMBER;
    if (portStr !== undefined && !isNaN(Number(portStr))) {
        port = Number(portStr);
    } else {
        port = ConfigConstants.DEFAULT_PORT;
    }

    // Connect to db
    console.log('Creating a db-connection - ');

    // Create a connection
    const connection = await createConnection();

    // Start the server
    console.log('Starting server');
    console.log(`Listening to port ${port}...`);
    new ChowkServer().start(port);
}

initializeServer().catch(e => {
    console.error(`Error initializing server - ${e}`)
});

