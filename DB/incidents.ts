import mongoose from "mongoose";


const incidentSchema = new mongoose.Schema({
 id: { type: String, required: true },
 pod: { type: String, required: true },
 namespace: { type: String, required: true },
 severity: { type: String, required: true },
 alertCount: { type: Number, required: true },
 status: { type: String, enum: ["open", "quarantined", "deleted"], required: true }
});

export const Incident = mongoose.model("Incident", incidentSchema);
