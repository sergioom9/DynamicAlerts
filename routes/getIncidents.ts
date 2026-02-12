import express, { Request, Response } from "express";
import { Incident } from "../DB/incidents.ts";
import {IncidentType} from "../types.ts";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const incidents: IncidentType[] = await Incident.find().select("-__v -_id");
        res.status(200).json(incidents);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;