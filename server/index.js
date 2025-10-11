import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import authenticate from "./middlewares/authenticate.js";
import erroHandler from "./middlewares/error-handler.js";
import auth from "./routes/auth.js";
import students from "./routes/students.js";
import departments from "./routes/departments.js";
import attendances from "./routes/attendances.js";
import classes from "./routes/classes.js";

const app = express();
const PORT = 5000;
// const options = {
//   key: fs.readFileSync(path.join(process.cwd(), "localhost+3-key.pem")),
//   cert: fs.readFileSync(path.join(process.cwd(), "localhost+3.pem")),
// };

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use((req, res, next) => (console.log(req.path, req.method), next()));
app.use(authenticate);
app.use(express.static(path.join(process.cwd(), "..", "client", "dist")));

app.use("/api/auth", auth);
app.use("/api/students", students);
app.use("/api/departments", departments);
app.use("/api/attendances", attendances);
app.use("/api/classes", classes);

app.get("/*index", (req, res) => {
  res.sendFile(path.join(process.cwd(), "..", "client", "dist", "index.html"));
});

app.use(erroHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
