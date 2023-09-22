import { Router } from "express";
import { register, verify } from "./auth.controller";
import { login } from "./auth.controller";
import { registerSchema } from "../../utils/Validations/register";
import validation from "../../middlewares/validation";

const router = Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", login);
router.post("/verify", verify);

export default {
  baseUrl: "/auth",
  router,
};
