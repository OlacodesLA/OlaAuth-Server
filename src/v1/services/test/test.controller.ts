import { Request, Response } from "express";
import { clientResponse } from "../../helpers/response";
import Logger from "../../libs/logger";

const testController = async (req: Request, res: Response) => {
  try {
    // Return response
    clientResponse(res, 201, {
      message: "Welcome to <Olacodes👾/> API v1.",
    });
  } catch (error: typeof Error | any) {
    // Return error
    Logger.error(`${error.message}`);
    clientResponse(res, 400, error.message);
  }
};

export { testController };
