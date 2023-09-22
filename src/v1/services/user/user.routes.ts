import { Router } from "express";
import { profile } from "./user.controller";
import Guard from "../../middlewares/guard";

const router = Router();

router.get("/profile", Guard, profile);

export default {
  baseUrl: "/",
  router,
};
