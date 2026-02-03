import mongoose from "mongoose";


const alertSchema = new mongoose.Schema({
  output: { type: String, required: true },
  priority: { type: String, required: true },
  rule: { type: String, required: true },
  time: { type: String, required: true },
  source: { type: String, required: false },
  tags: { type: [String], required: false }, 
});

export const Alert = mongoose.model("Alert", alertSchema);
