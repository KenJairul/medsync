const express = require('express');
const { v4: uuidv4 } = require('uuid');
const MedicalRecord = require('../models/MedicalRecord');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      contact,
      address,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      medications,
      doctorNotes,
      doctorName,
      hospitalName,
      admissionDate,
      dischargeDate
    } = req.body;

    const newRecord = new MedicalRecord({
      patientName,
      age,
      gender,
      contactNumber: contact,
      address,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      medications,
      doctorNotes,
      doctorName,
      hospitalName,
      admissionDate,
      dischargeDate,
      uniqueId: uuidv4(),
      dateOfVisit: new Date() 
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const records = await MedicalRecord.find({
      $or: [
        { patientName: { $regex: query, $options: 'i' } },
        { uniqueId: query }
      ]
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
