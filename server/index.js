import express from "express";
import cors from "cors";

import authenticate from "./middlewares/authenticate.js";
import erroHandler from "./middlewares/error-handler.js";
import auth from "./routes/auth.js";
import students from "./routes/students.js";
import departments from "./routes/departments.js";
import attendances from "./routes/attendances.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
// app.use((req, res, next) => (console.log(req.path, req.method), next()));
app.use(authenticate);

app.use("/auth", auth);
app.use("/students", students);
app.use("/departments", departments);
app.use("/attendances", attendances);

app.use(erroHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
