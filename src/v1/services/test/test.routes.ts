import { Router } from "express";
import { testController } from "./test.controller";

const router = Router();
//Test Route
router.get("/", testController);

export default {
  baseUrl: "/",
  router,
  auth: false,
};
