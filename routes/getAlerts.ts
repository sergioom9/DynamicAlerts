import express, { Request, Response } from "express";
import { Alert } from "../DB/alert.ts";
import {FalcoAlert} from "../types.ts";

const router = express.Router();


router.get("/", async (_req: Request, res: Response) => {
    try {
        const alerts: FalcoAlert[] = await Alert.find().select("-__v -_id");
        res.status(200).json(alerts);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;