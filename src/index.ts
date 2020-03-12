import * as express from 'express';
import {Request, Response} from 'express';
import * as bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// routes

app.get('/hi', (req: Request, response: Response) => {
    response.status(200).json({
        'hi': 'hi',
    })
});

console.log('Listening to port 2000...');
app.listen(2000);