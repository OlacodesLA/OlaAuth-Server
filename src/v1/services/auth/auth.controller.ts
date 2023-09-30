import { clientResponse, clientCookieResponse } from "../../helpers/response";
import { Response, Request } from "express";
import Services from "../../helpers/model.helper";
import User from "../user/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateExpirationTime,
  generateVerificationCode,
  sendVerificationEmail,
} from "../../helpers/email.helper";
import config from "../../config";

const userService = new Services(User);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = config.SECRET as string;

// Register

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const newUserData = {
      username,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      admin: false,
    };

    // Check if user exists
    const userEmailExists = await userService.getOne({ email });
    const userUsernameExists = await userService.getOne({ username });

    if (userEmailExists || userUsernameExists) {
      return clientResponse(
        res,
        409,
        {
          success: false,
          message: "User with email already exists",
        },
        true
      );
    }
    // Create new user
    const newUser = await userService.create(newUserData);

    await newUser.save();

    // Generate and save a new verification code
    const verificationCode = await generateAndSaveVerificationCode(newUser._id);

    // Send the verification email
    await sendVerificationEmail(newUser.email, verificationCode);

    return clientResponse(
      res,
      201,
      {
        success: true,
        message: "Account created successfully",
        data: newUser,
      },
      true
    );
  } catch (error) {
    clientResponse(res, 500, { success: false, message: error });
  }
};

// Login

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await userService.getOne({ email });

    if (!userExists) {
      return clientResponse(
        res,
        404,
        {
          success: false,
          message: "Account not found, Please register first",
        },
        true
      );
    }
    // Compare passwords and generate token for the logged in user
    const passwordOk = bcrypt.compareSync(password, userExists.password);

    if (passwordOk) {
      jwt.sign(
        { email: userExists.email, id: userExists._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err)
            return clientResponse(res, 500, { success: false, message: err });

          clientCookieResponse(
            res,
            200,
            token,
            {
              success: true,
              message: "Successfully Logged In",
              data: userExists,
            },
            true
          );
          
        }
      );
    } else {
      return clientResponse(
        res,
        401,
        {
          success: false,
          message: "Password Incorrect",
        },
        true
      );
    }
  } catch (error) {
    clientResponse(res, 401, { success: false, message: error });
  }
};

// Logout

export const logout = async (req: Request, res: Response) => {
  try {
    clientCookieResponse(
      res,
      200,
      "",
      {
        success: true,
        message: "Successfully Logged Out",
      },
      true
    );
  } catch (error) {
    console.error("Error logging out:", error);
    return clientResponse(res, 500, {
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify

export const verify = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    // Find the user by their email
    const user = await userService.getOne({ email });

    // Check if the user exists and if the provided verification code matches

    if (!user) {
      return clientResponse(
        res,
        400,
        {
          success: false,
          message: "User not found.",
        },
        true
      );
    }
    // Check if user is verified
    if (user.isVerified === true) {
      return clientResponse(
        res,
        200,
        {
          success: true,
          message: "User already verified",
        },
        true
      );
    }

    if (verificationCode !== user.verificationCode) {
      return clientResponse(
        res,
        400,
        {
          success: false,
          message: "Invalid verification code",
        },
        true
      );
    }
    // Check if the verification code has expired
    if (
      user.verificationCodeExpiration &&
      user.verificationCodeExpiration < Date.now()
    ) {
      return clientResponse(
        res,
        400,
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        true
      );
    }

    await userService.getOneAndUpdate(
      { email },
      {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiration: null,
      }
    );

    return clientResponse(
      res,
      200,
      {
        success: true,
        message: "Account verified successfully.",
      },
      true
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return clientResponse(res, 500, {
      success: false,
      message: "Internal server error",
    });
  }
};

//Resend Verification Code

export const resendCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userService.getOne({ email });

    if (!user) {
      return clientResponse(
        res,
        400,
        {
          success: false,
          message: "User not registered",
        },
        true
      );
    }

    // Generate and save a new verification code
    const verificationCode = await generateAndSaveVerificationCode(user._id);

    // Send the verification email
    await sendVerificationEmail(user.email, verificationCode);

    return clientResponse(
      res,
      200,
      {
        success: true,
        message: "Verification code sent",
      },
      true
    );
  } catch (error) {
    return clientResponse(
      res,
      500,
      {
        success: false,
        message: "Internal Server Error",
      },
      true
    );
  }
};

// Generate and save verification code

async function generateAndSaveVerificationCode(userId: any) {
  // Generate Verification Code
  const verificationCode = generateVerificationCode();

  // Generate Expiration Time
  const expirationTime = generateExpirationTime();

  // Update the data
  try {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          verificationCode,
          verificationCodeExpiration: expirationTime,
        },
      }
    );

    return verificationCode;
  } catch (error) {
    console.error("Error generating and saving verification code:", error);
    throw error;
  }
}

//Check If user exist
export const checkIfUserExists = async (req: Request, res: Response) => {
  const { username } = req.body;
  // Update the data
  try {
    const userExists = await userService.getOne({ username });

    if (!userExists) {
      return clientResponse(res, 200, {
        success: true,
        message: "Username is available",
      });
    }

    return clientResponse(res, 400, {
      success: false,
      message: "Username already exists",
    });
  } catch (error) {
    console.error("Error fetching Username:", error);
    throw error;
  }
};
