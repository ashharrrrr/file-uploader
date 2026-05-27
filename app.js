import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import "./strategies/passportlocal.config.js";
import { prisma } from "./lib/prisma.js";
import authRouter from "./routes/auth.routes.js";
import folderRouter from "./routes/folder.routes.js";
import fileRouter from "./routes/file.routes.js";
import sharedRouter from "./routes/sharedFile.router.js";
import flash from "connect-flash";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;

  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");

  next();
})

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);
app.use("/shared", sharedRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on 3000!");
});
