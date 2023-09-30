import { Response, Request, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "../config";
import User from "../services/user/user.model";
import Services from "../helpers/model.helper";
import { clientResponse } from "../helpers/response";

interface UserData {
  id: string;
}

const jwtSecret = config.SECRET as string;
const userService = new Services(User);

const Guard = async (req: any, res: Response, next: NextFunction) => {
  const { token } = req.cookies;

  if (!token) {
    return clientResponse(res, 401, {
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const userData = jwt.verify(token, jwtSecret) as UserData;

    const user = await userService.getOne({ _id: userData.id });

    if (!user) {
      return clientResponse(res, 401, {
        success: false,
        message: "User not found",
      });
    }

    // Attach user data to the request for future route handlers
    req.user = user;

    next(); // Proceed to the protected route
  } catch (error: any) {
    console.error(error);

    if (error instanceof JsonWebTokenError) {
      // Handle invalid token signature error
      return clientResponse(res, 401, {
        success: false,
        message: "Invalid token signature",
      });
    } else if (error.name === "TokenExpiredError") {
      return clientResponse(res, 401, {
        success: false,
        message: "Token has expired",
      });
    }

    return clientResponse(res, 500, {
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default Guard;
