import mongoose from "mongoose";

const outputFieldsSchema = new mongoose.Schema({
  user: { type: String, required: true },
  process_name: { type: String, required: false },
  file: { type: String, required: false },
  container_id: { type: String, required: true },
}, { _id: false });

const alertSchema = new mongoose.Schema({
  output: { type: String, required: true },
  priority: { type: String, required: true },
  rule: { type: String, required: true },
  time: { type: String, required: true },
  source: { type: String, required: false },
  tags: { type: [String], required: true }, 
  output_fields: { type: outputFieldsSchema, required: true }, 
});

export const Alert = mongoose.model("Alert", alertSchema);
