import { body, validationResult }
from "express-validator";

export const validateSignup = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage(
      "Name must be at least 3 characters"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  handleValidationErrors,
];


export const validateLogin = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors,
];


export const validateFolder = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage(
      "Folder name is required"
    )
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Folder name must be between 2 and 50 characters"
    ),

  handleValidationErrors,
];


function handleValidationErrors(
  req,
  res,
  next
) {

  const errors =
    validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  errors.array().forEach(error => {

    req.flash(
      "error",
      error.msg
    );
  });

  return res.redirect(
    req.get("Referrer") || "/"
  );
}