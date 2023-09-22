import { Request, Response, NextFunction } from "express";

const validation =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {
      await schema.validate(body);
      next();
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  };

export default validation;
