import express from "express";
import dotenv from "dotenv";
import walletRoutes from "./routes/wallet.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});