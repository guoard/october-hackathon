import Path from "path";

import Joi from "joi";
import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";

import companyRoutes from "../routes/CompanyRoutes";
import advocateRoutes from "../routes/AdvocateRoutes";

const server = Hapi.server({
  port: 8000 || process.env.PORT,
  host: "0.0.0.0" || process.env.HOST,
  router: {
    stripTrailingSlash: true,
  },
  routes: {
    cors: { origin: ["*"] },
  },
});

const initServer = async () => {
  await server.register(Inert);
  server.route({
    method: "GET",
    path: "/media/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "..", "..", "media"),
      },
    },
  });

  server.validator(Joi);

  server.route(companyRoutes);
  server.route(advocateRoutes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

export default initServer;
