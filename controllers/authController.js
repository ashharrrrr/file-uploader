import bcrypt, { hash } from "bcryptjs";
import { db } from "../db/queries.js";
import passport from "passport";
import "../strategies/passportlocal.config.js";
import { prisma } from "../lib/prisma.js";
import { getFolderData } from "../services/folder.service.js";

export async function indexGet(req, res) {
  if (!req.user) return res.redirect("/login");
  try {
   const data = await getFolderData(
    req.user.rootFolderId,
    req.user.id
   );

   res.render("index", {
    user: req.user,
    ...data
   });

  } catch (err) {
    console.error(err);
    req.flash("error", "Server Error");
    res.redirect("/");
  }
}

export const signUpUser = [
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body; 
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
      })

      let rootFolder = await prisma.folder.create({
        data: {
            name: "My Drive",
            userId: user.id,
            parentId: null,
            path: "temp"
        }
      });

      rootFolder = await prisma.folder.update({
        where: {
            id: rootFolder.id
        }, 
        data: {
            path: `/${rootFolder.id}`
        }
      });

      await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            rootFolderId: rootFolder.id
        }
      })

      res.redirect("/login");

    } catch (err) {
      if (err.code === "P2002") {
        req.flash("error", "Email already exists!");
        return res.redirect("/signUp");
      }
      console.error(err);
      req.flash("error", "Signup Failed!");
      return res.redirect("/signUp");
    }
  },
];

export const loginUser = (req, res, next) => {
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
