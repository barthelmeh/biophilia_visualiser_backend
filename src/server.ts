import express from "./config/express";
import { connect } from "./config/db";
import Logger from './config/logger';

const app = express();
const port: number = parseInt(process.env.PORT, 10) || 4941;

async function main() {
  try {
    await connect();
    app.listen(port, '0.0.0.0', () => {
      Logger.info(`Listening on port: ${port}`);
    });
  } catch (err) {
    Logger.error(`Unable to connect to the database.\n${err}`)
    process.exit(-1);
  }
}

main().catch((err) => Logger.error(err));