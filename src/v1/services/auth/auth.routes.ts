import { Router } from "express";
import {
  register,
  verify,
  checkIfUserExists,
  resendCode,
  logout,
} from "./auth.controller";
import { login } from "./auth.controller";
import { registerSchema } from "../../utils/Validations/register";
import validation from "../../middlewares/validation";

const router = Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-code", resendCode);
router.post("/check-username", checkIfUserExists);
router.post("/logout", logout);

export default {
  baseUrl: "/auth",
  router,
};
