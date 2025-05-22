import express from "express";
import cors from "cors";

import authenticate from "./middlewares/authenticate.js";
import erroHandler from "./middlewares/error-handler.js";
import departments from "./routes/departments.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use((req, res, next) => (console.log(req.path, req.method), next()));

app.use("/departments", departments);

app.use(erroHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
