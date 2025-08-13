import express from "express";
import { createWallet, getBalance, sendTON } from "../controllers/walletController.js";

const router = express.Router();

router.post("/create", createWallet);
router.get("/balance/:address", getBalance);
router.post("/send", sendTON);

export default router;