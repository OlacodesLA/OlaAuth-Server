import config from "../config";

const NODE_ENV = config.SECRET as string;
const CLIENT_URL = config.CLIENT_URL as string;

// Response handler
export const clientResponse = (
  res: any,
  status: number,
  message: object | string,
  toast?: any
) => {
  function isSuccess(code: string) {
    if (code.startsWith("2")) {
      return true;
    } else {
      return false;
    }
  }

  const responseObj =
    typeof message === "string"
      ? {
          success: isSuccess(String(status)),
          message: message,
          toast: toast ? toast : false,
        }
      : {
          success: isSuccess(String(status)),
          ...message,
          toast: toast ? toast : false,
        };

  return res.status(status).send(responseObj).end();
};

// Response handler
export const clientCookieResponse = (
  res: any,
  status: number,
  cookie: string | undefined,
  message: string | object,
  toast: boolean
) => {
  function isSuccess(code: string) {
    if (code.startsWith("2")) {
      return true;
    } else {
      return false;
    }
  }
  console.log(CLIENT_URL);
  return res
    .status(status)
    .cookie("token", cookie, {
      path: "/",
      domain: CLIENT_URL,
      httpOnly: true,
      secure: true, // Use 'true' if your application uses HTTPS
      sameSite: "None", // Explicitly set SameSite to None for cross-origin cookies
    })
    .send(
      typeof message === "string"
        ? {
            success: isSuccess(String(status)),
            message: message,
            toast: toast ? toast : false,
          }
        : {
            success: isSuccess(String(status)),
            ...message,
            toast: toast ? toast : false,
          }
    )
    .end();
};
