import bcrypt from "bcryptjs";
import { db } from "../db/queries.js";
import passport from "passport";
import "../strategies/passportlocal.config.js";

export async function indexGet(req, res) {
  if (!req.user) return res.redirect("/login");
  const user = req.user;
  return res.render("index", { user });
}

export const signUpUser = [
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.addUser(name, email, hashedPassword);
      res.redirect("/login");
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).render("signUp", {
          errors: [{ msg: "Email already exists!" }],
          old: req.body,
        });
      }
      next(err);
    }
  },
];

export const loginUser = (req, res, next) => {
  console.log("loginUser handler invoked");
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signUp",
  })(req, res, next);
};

export async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
