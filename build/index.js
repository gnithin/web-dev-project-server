"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const config_1 = require("./constants/config");
const core_1 = require("@overnightjs/core");
const userController_1 = require("./controllers/userController");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const questionController_1 = require("./controllers/questionController");
const cors = require("cors");
const dotenv = require("dotenv");
const answerController_1 = require("./controllers/answerController");
if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: './.dev.env' });
}
else {
    dotenv.config();
}
const corsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
};
class ChowkServer extends core_1.Server {
    constructor() {
        super(false);
        this.app.use(bodyParser.json());
        this.app.use(cors(corsOptions));
        super.addControllers([
            new userController_1.UserController(),
            new questionController_1.QuestionController(),
            new answerController_1.AnswerController(),
        ]);
    }
    start(portNumber) {
        this.app.listen(portNumber);
    }
}
async function initializeServer() {
    let port;
    const portStr = process.env.PORT;
    if (portStr !== undefined && !isNaN(Number(portStr))) {
        port = Number(portStr);
    }
    else {
        port = config_1.default.DEFAULT_PORT;
    }
    console.log('Creating a db-connection - ');
    const connection = await typeorm_1.createConnection();
    console.log('Starting server');
    console.log(`Listening to port ${port}...`);
    new ChowkServer().start(port);
}
initializeServer().catch(e => {
    console.error(`Error initializing server - ${e}`);
});
