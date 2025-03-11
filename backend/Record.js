const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  diagnosis: { type: String, required: true },
  prescriptionHistory: { type: [String], default: [] },
  doctorName: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Record", RecordSchema);
