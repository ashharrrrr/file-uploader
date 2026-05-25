import { Router } from "express";
import { signUpUser, indexGet, loginUser, logout } from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/", indexGet);

authRouter.get("/login", (req, res) => res.render("login"));
authRouter.post("/login", loginUser);

authRouter.get("/signUp", (req, res) => res.render("signUp"));
authRouter.post("/signUp", signUpUser);

authRouter.get("/logout", logout);

export default authRouter;
