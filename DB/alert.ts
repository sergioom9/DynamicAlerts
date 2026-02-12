import mongoose from "mongoose";


const alertSchema = new mongoose.Schema({
  output: { type: String, required: true },
  containerid : { type: String, required: true },
  containername : { type: String, required: false },
  namespace : { type: String, required: false },
  podname : { type: String, required: false },
  username : { type: String, required: false },
  useruid : { type: String, required: false },
  priority: { type: String, required: true },
  rule: { type: String, required: true },
  time: { type: Date, required: true },
  source: { type: String, required: false },
  tags: { type: [String], required: false }, 
});

export const Alert = mongoose.model("Alert", alertSchema);
