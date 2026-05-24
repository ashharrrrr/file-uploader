import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import indexRouter from "./routes/indexrouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetPath = path.join(__dirname, "public");
app.use(express.static(assetPath));

app.use("/", indexRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on 3000!");
});
