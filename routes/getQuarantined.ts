import express, { Request, Response } from "express";
import { Quarantined } from "../DB/quarantined.ts";
import { QuarantineType } from "../types.ts";

const router = express.Router();


router.get("/", async (_req: Request, res: Response) => {
    try {
        const quarantined: QuarantineType[] = await Quarantined.find().select("-__v -_id");
        res.status(200).json(quarantined);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;