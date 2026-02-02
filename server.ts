import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import alertRoutes from "./routes/alert.ts";
import getAlertsRoutes from "./routes/getAlerts.ts";

dotenv.config();

const app = express();
const port = 3000;
const mongoUri = Deno.env.get("MONGO_URI") || "";

//app.use(cookieParser());
app.use(express.json());
app.use("/alert", alertRoutes);
app.use("/", getAlertsRoutes);


mongoose.connect(mongoUri)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));