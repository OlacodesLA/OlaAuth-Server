import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Replace with your actual configuration
import config from "../config"; // Import your user service or database functions here
import User from "../services/user/user.model";
import Services from "../helpers/model.helper";
import { clientResponse } from "../helpers/response";

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

  jwt.verify(token, jwtSecret, {}, async (err: any, userData: any) => {
    if (err) {
      return clientResponse(res, 401, {
        success: false,
        message: "Unauthorized",
      });
    }

    try {
      const user = await userService.getOne({ _id: userData.id });

      if (!user) {
        return clientResponse(
          res,
          401,
          {
            success: false,
            message: "User not found",
          },
          true
        );
      }

      // Attach user data to the request for future route handlers
      req.user = user;

      next(); // Proceed to the protected route
    } catch (error) {
      console.log(error);
      return clientResponse(res, 501, {
        success: false,
        message: "Internal Server Error",
      });
    }
  });
};

export default Guard;
