import mongoose from "mongoose";


const quarantineSchema = new mongoose.Schema({
 pod: { type: String, required: true },
 namespace: { type: String, required: true },
});

export const Quarantined = mongoose.model("Quarantined", quarantineSchema);
