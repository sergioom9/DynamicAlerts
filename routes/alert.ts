import express, { Request, Response } from "express";
import { Alert } from "../DB/alert.ts";

const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    try {
        if (
            req.body.output == null ||
            req.body.priority == null ||
            req.body.rule == null ||
            req.body.time == null ||
            req.body.source == null ||
            req.body.output_fields == null ||
            req.body.output_fields.process_name == null ||
            req.body.output_fields.container_id == null
        ) {
            return res.status(400).json({ error: "Missing params" });
        }
        const alert = new Alert({
            output: req.body.output,
            priority: req.body.priority ,
            rule: req.body.rule ,
            time: req.body.time ,
            source: req.body.source || "null",
            tags: req.body.tags ,
            output_fields: req.body.output_fields || []
        });
        await alert.save();
        if(!alert){
            return res.status(409).json({ error: "Alert not saved" });
        }
        return res.status(200).json({ success:true,alert });
        } catch (err: Error | any) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;