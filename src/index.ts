import initServer from "./bootstrap/server";
import dbConnection from "./bootstrap/database";

const start = async () => {
  await dbConnection();
  await initServer();
};

process.on('uncaughtException', (err) => {
  console.log('Shutting down due to an uncaught exception...');
  console.log(err);
  process.exit(1);
});

start();
