import * as bodyParser from 'body-parser';
import ConfigConstants from './constants/config'
import {Server} from '@overnightjs/core';
import {UserController} from './controllers/user_controller';
import 'reflect-metadata';
import {createConnection} from 'typeorm';

class ChowkServer extends Server {
    constructor() {
        // super(process.env.NODE_ENV === 'development');
        super(false);
        this.app.use(bodyParser.json());
        super.addControllers(
            [
                new UserController(),
            ]
        );
    }

    public start(portNumber: number) {
        this.app.listen(portNumber);
    }
}

let port: number;
const portStr: string | undefined = process.env.PORT_NUMBER;
if (portStr !== undefined && !isNaN(Number(portStr))) {
    port = Number(portStr);
} else {
    port = ConfigConstants.DEFAULT_PORT;
}

// Connect to db

console.log('Creating a db-connection - ');
createConnection().then((connection) => {
    // Start server
    console.log('Starting server');
    console.log(`Listening to port ${port}...`);
    new ChowkServer().start(port);
}).catch(err => {
    console.error(`Error creating a db-connection - ${err}`)
});

