import mongoose from "mongoose";
import config from "../config";

import { ConnectOptions, connect } from "mongoose";

type ConnectionOptionsExtend = {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
};

const options: ConnectOptions & ConnectionOptionsExtend = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
};

function cleanup() {
  mongoose.connection.close(function () {
    process.exit(0);
  } as never);
}

export default {
  connect: async () => {
    try {
      await mongoose
        .connect(config.MONGO_URI || "", options)
        .then(() => {
          console.info("Database connection established <3");
        })
        .catch((err) => console.log("we couldn't connect because:", err));
      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);
      process.on("SIGHUP", cleanup);
    } catch (error) {
      console.error(error, {
        message: "mongo server didn't connect ",
      });
      process.exit(1);
    }
  },
};
