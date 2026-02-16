import { KubeConfig, CoreV1Api, NetworkingV1Api } from "@kubernetes/client-node";
import express, { Request, Response } from "express";
import { Quarantined } from "../DB/quarantined.ts";

const router = express.Router();

const kc = new KubeConfig();

if (Deno.env.get("KUBERNETES_SERVICE_HOST")) {
  kc.loadFromCluster();
} else {
  kc.loadFromDefault();
}

const k8sApi = kc.makeApiClient(CoreV1Api);
const networkingApi = kc.makeApiClient(NetworkingV1Api);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { namespace, pod } = req.body;

    if (!namespace || !pod) {
      return res.status(400).json({ error: "Missing params" });
    }

    // quarantined=true al pod
    const patch = [
      { op: "add", path: "/metadata/labels/quarantined", value: "true" },
    ];

    await k8sApi.patchNamespacedPod({
      name: pod,
      namespace,
      body: patch,
      contentType: "application/json-patch+json",
    });

    // NetworkPolicy bloquear el trafico 
    const networkPolicy = {
      apiVersion: "networking.k8s.io/v1",
      kind: "NetworkPolicy",
      metadata: {
        name: `quarantine-${pod}`,
        namespace,
      },
      spec: {
        podSelector: {
          matchLabels: {
            quarantined: "true",
          },
        },
        policyTypes: ["Ingress", "Egress"],
        // Ingress Egress vacíos para bloquear el tráfico
        ingress: [],
        egress: [],
      },
    };

    // NetworkPolicy
    try {
      await networkingApi.createNamespacedNetworkPolicy({
        namespace,
        body: networkPolicy,
      });
      console.log(`NetworkPolicy creada`);
    } catch (err) {
      if (err.code === 409) {
        console.log(`NetworkPolicy existe`);
      } else {
        throw err;
      }
    }
    const addQuarantine = new Quarantined({pod:pod,namespace:namespace})
    await addQuarantine.save()
    if(!addQuarantine){return res.status(200).json({success: false,message:"Failed saving to DB"})}
    return res.status(200).json({
      success: true,
      pod,
      namespace,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { namespace, pod } = req.body;

    if (!namespace || !pod) {
      return res.status(400).json({ error: "Missing params" });
    }

    const patch = [
      {
        op: "remove",
        path: "/metadata/labels/quarantined"
      },
    ];

    await k8sApi.patchNamespacedPod({
      name: pod,
      namespace,
      body: patch,
      contentType: "application/json-patch+json",
    });

    // Eliminar NetworkPolicy
    try {
      await networkingApi.deleteNamespacedNetworkPolicy({
        name: `quarantine-${pod}`,
        namespace,
      });
    } catch (err) {
      if (err.code === 404) {
      } else {
        throw err;
      }
    }

     await Quarantined.deleteMany({ 
      pod: pod, 
      namespace: namespace 
    });

    return res.status(200).json({
      success: true,
      pod,
      namespace,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;