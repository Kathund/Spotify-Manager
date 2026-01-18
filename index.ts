import './src/Private/Logger.js';
import 'dotenv/config';

import Application from './src/Application.js';

const app = new Application();
app.connect();
