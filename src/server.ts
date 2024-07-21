import express, { Request, Response } from 'express';
import Logger from './config/logger';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  Logger.info(`Server is running at http://localhost:${port}`);
});