const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  bloodType: { type: String },
  allergies: { type: String },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  medications: { type: String },
  doctorNotes: { type: String },
  doctorName: { type: String, required: true },
  hospitalName: { type: String },
  admissionDate: { type: Date },
  dischargeDate: { type: Date },
  dateOfVisit: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
