import express, { Request, Response } from "express";
import { KubeConfig, CoreV1Api } from "@kubernetes/client-node";

const router = express.Router();

const kc = new KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(CoreV1Api);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { namespace, pod } = req.body;

    if (!pod || !namespace) {
      return res.status(400).json({ 
        error: "Missing params",
        received: { pod, namespace }
      });
    }

    await k8sApi.deleteNamespacedPod({
      name: pod,
      namespace: namespace,
    });

    return res.json({
      status: "Pod deleted",
      pod,
      namespace,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;