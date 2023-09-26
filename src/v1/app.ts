import express, { NextFunction, Request, Response } from "express";
import rateLimiter from "express-rate-limit";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { clientResponse } from "./helpers/response";
import Logger from "./libs/logger";
import DB from "./helpers/database";
import config from "./config";
import apiRoutes from "./routes";

const app = express();

app.disable("x-powered-by");

// Middlewares
const initMiddlewares = () => {
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://olaauth.vercel.app"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    })
  );
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 500, // limit each IP to 100 requests per windowMs
    })
  );
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

//Routes
const initRoutes = () => {
  app.use("/v1", apiRoutes);
  app.all("/", (req: any, res: any) => {
    clientResponse(res, 200, "Welcome to <Olacodes👾/> backend server");
  });
  app.all("**", (req: any, res: any) =>
    clientResponse(res, 401, "Route not found, try check your browser url")
  );

  Logger.info("Routers initialized <3");
};

// Database Logger
const initDataBaseConnection = async () => {
  await DB.connect();
  Logger.info("database connected, happy hacking 💖");
  return true;
};

const initProcessHandler = () => {
  process.on("uncaughtException", (err) => {
    Logger.info("there was an uncaught exception, shutting down! 🤬🤬", err);
  });

  process.on("unhandledRejection", (err) => {
    Logger.info("this rejection wasnt handled, shutting down! 🤬🤬", err);
    process.exit(1);
  });
};

const initServer = (port: number | string) => {
  app.listen(port, () =>
    Logger.info(`Server running 🏃‍♂️🏃‍♀️, Our app is live 🥳🙌 on PORT: ${port}`)
  );
};

export default {
  start: async () => {
    const dbConnected = await initDataBaseConnection();

    if (dbConnected) {
      initMiddlewares();

      initRoutes();

      initServer(config.PORT || 3000);

      initProcessHandler();
    }
  },

  stop: () => {
    Logger.info("exiting applicaton  🤬🤬");
    process.exit(1);
  },
};
