import { Router } from "express";
import { signUpUser, indexGet, loginUser, logout } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../services/validators.service.js";

const authRouter = Router();

authRouter.get("/", indexGet);

authRouter.get("/login", (req, res) => res.render("login"));
authRouter.post("/login", validateLogin, loginUser);

authRouter.get("/signUp", (req, res) => res.render("signUp"));
authRouter.post("/signUp", validateSignup, signUpUser);

authRouter.get("/logout", logout);

export default authRouter;
