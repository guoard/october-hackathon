import initServer from "./bootstrap/server";
import dbConnection from "./bootstrap/database";

const start = async () => {
  await dbConnection();
  await initServer();
};

start();
