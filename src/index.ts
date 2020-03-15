import * as express from 'express';
import {Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import ConfigConstants from './constants/config'

const app = express();
app.use(bodyParser.json());

// routes

app.get('/hi', (req: Request, response: Response) => {
    response.status(200).json({
        'hi': 'hi',
    })
});

let port: number;
const portStr: string | undefined = process.env.PORT_NUMBER;
if (portStr !== undefined && !isNaN(Number(portStr))) {
    port = Number(portStr);
} else {
    port = ConfigConstants.DEFAULT_PORT;
}

console.log('Starting server');
console.log(`Listening to port ${port}...`);
app.listen(port);