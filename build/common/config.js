"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
console.log('DEBUG: - ', process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
    case 'production':
        dotenv.config({ path: '../../.dev.env' });
        break;
    default:
        break;
}
