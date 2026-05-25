import { Router } from "express";
import { signUpUser, indexGet, loginUser, logout } from "../controllers/authController.js";
import passport from "passport";
import "../strategies/passportlocal.config.js";

const indexRouter = Router();

indexRouter.get("/", indexGet);

indexRouter.get("/login", (req, res) => res.render("login"));
indexRouter.post("/login", loginUser);

indexRouter.get("/signUp", (req, res) => res.render("signUp"));
indexRouter.post("/signUp", signUpUser);

indexRouter.get("/logout", logout);

export default indexRouter;
