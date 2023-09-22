"use strict";

import { glob } from "glob";
import express from "express";
import path from "path";
import config from "../config";

const router = express.Router();

const devFilePath = `${process.cwd()}/src/v1/services`;
const prodFilePath = `${process.cwd()}/dist/src/v1/services`;

const pattern =
  config.NODE_ENV === "production" ? "**/*.routes.js" : "**/*.routes.ts";
const ignoreFile = config.NODE_ENV === "production" ? "index.js" : "index.ts";
const cwdPath = config.NODE_ENV === "production" ? prodFilePath : devFilePath;

// console.log(config.NODE_ENV)

glob
  .sync(pattern, {
    cwd: cwdPath,
    ignore: ignoreFile,
  })
  .forEach(async (file: any) => {
    const filePath = path.join(cwdPath, file);

    const fileRoutes = await import(filePath);

    if (fileRoutes.default.auth) {
      router.use(fileRoutes.default.baseUrl, fileRoutes.default.router);
    } else {
      router.use(fileRoutes.default.baseUrl, fileRoutes.default.router);
    }
  });

export default router;
