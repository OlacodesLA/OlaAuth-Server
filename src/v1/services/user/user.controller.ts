import { clientResponse } from "../../helpers/response";
import { Response, Request } from "express";
import Services from "../../helpers/model.helper";
import User from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const userService = new Services(User);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = config.SECRET as string;

// Profile

export const profile = (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    return clientResponse(res, 401, {
      success: false,
      message: "User Unauthorized",
    });
  }

  // Here, you can access the user data
  const { id, username, email } = user;

  clientResponse(res, 200, {
    success: true,
    message: "Profile data retrieved successfully",
    data: {
      id,
      username,
      email,
    },
  });
};
