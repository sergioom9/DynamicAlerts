import express, { Request, Response } from "express";
import { Alert } from "../DB/alert.ts";
import {FalcoAlert} from "../types.ts"
import { Incident } from "../DB/incidents.ts";


const router = express.Router();

const checkForIncident = async (podname: string) => {
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

  const count = await Alert.countDocuments({
    podname,
    time: { $gte: fifteenMinsAgo }
  });

  return count > 2;
};


router.post("/", async (req: Request, res: Response) => {
    try {
        if (
            req.body.output == null ||
            req.body.priority == null ||
            req.body.rule == null ||
            req.body.time == null ||
            req.body.output_fields["container.id"] == null 
        ) {
            return res.status(200).json({ error: "Missing params" });
        }
        if (req.body.output.includes('cilium')) {
            return res.status(200).json({ error: "Alerta no deseada" });
        }
        const alert = new Alert({
            output: req.body.output,
            priority: req.body.priority ,
            rule: req.body.rule ,
            time: new Date(req.body.time) ,
            containerid: req.body.output_fields["container.id"],
            containername : req.body.output_fields["container.name"],
            podname:req.body.output_fields["k8s.pod.name"],
            namespace:req.body.output_fields["k8s.ns.name"],
            username:req.body.output_fields["user.name"],
            useruid:req.body.output_fields["cuser.uid"],
        });
        await alert.save();
        if(!alert){
            return res.status(200).json({ error: "Alert not saved" });
        }
        const incident = await checkForIncident(req.body.output_fields["k8s.pod.name"])
        if(incident){
            const newIncident = new Incident({
                id: req.body.output_fields["container.id"],
                pod: req.body.output_fields["k8s.pod.name"],
                namespace: req.body.output_fields["k8s.ns.name"],
                severity: req.body.priority,
                alertCount: 3,
                status: "open"
            })
            await newIncident.save();

        }
        return res.status(200).json({ success:true,alert,incident });
        } catch (err: Error | any) {
        console.log(err)
        res.status(200).json({ error: "Internal Server Error" });
    }
});


export default router;
