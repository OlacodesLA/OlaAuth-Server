import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup.string().required("Username cannot be emoty"),
  // firstName: yup.string().required("First Name cannot be empty"),
  // lastName: yup.string().required("Last Name cannot be empty"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email cannot be empty"),
  password: yup
    .string()
    .min(6, "Please enter a valid password")
    .required("Password cannot be empty"),
  admin: yup.boolean(),
});
