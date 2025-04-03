import dotenv from 'dotenv'
dotenv.config()
import http from 'http';
import app from './app.js';
import { processQueue } from './app.js';

const port = process.env.PORT || 7000;

const server = http.createServer(app);


server.listen(port, () => {
  console.log(`Server running on port http://localhost${port}`);
  processQueue();
});