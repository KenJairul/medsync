import { useState } from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    bloodType: "",
    allergies: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    doctorNotes: "",
    doctorName: "",
    hospitalName: "",
    admissionDate: "",
    dischargeDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/medical-records`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register patient");
      }

      const data = await response.json();

      if (data.uniqueId) {
        setUniqueId(data.uniqueId); // Save the unique ID for the modal
        setShowModal(true); // Show the modal
      } else {
        alert("Registration successful, but no unique ID was returned.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error registering patient.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      patientName: "",
      age: "",
      gender: "",
      contact: "",
      address: "",
      bloodType: "",
      allergies: "",
      diagnosis: "",
      treatment: "",
      medications: "",
      doctorNotes: "",
      doctorName: "",
      hospitalName: "",
      admissionDate: "",
      dischargeDate: "",
    });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h2>Medical Record Registration</h2>
          <p>Please fill in the patient details below</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Information Section */}
          <div className="form-section">
            <h3>Patient Information</h3>
            <div className="input-group">
              <div className="form-field">
                <label>Patient Name</label>
                <input type="text" name="patientName" onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Age</label>
                <input type="number" name="age" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <div className="form-field">
                <label>Gender</label>
                <select name="gender" onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Prefer not to say</option>
                </select>
              </div>
              <div className="form-field">
                <label>Contact</label>
                <input type="text" name="contact" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-field">
              <label>Address</label>
              <input type="text" name="address" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <div className="form-field">
                <label>Blood Type</label>
                <select name="bloodType" onChange={handleChange} required>
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="form-field">
                <label>Allergies (if any)</label>
                <input type="text" name="allergies" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Medical Details Section */}
          <div className="form-section">
            <h3>Medical Details</h3>
            <div className="form-field">
              <label>Diagnosis</label>
              <input type="text" name="diagnosis" onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Treatment</label>
              <textarea name="treatment" onChange={handleChange} required></textarea>
            </div>
            <div className="form-field">
              <label>Medications</label>
              <textarea name="medications" onChange={handleChange}></textarea>
            </div>
            <div className="form-field">
              <label>History</label>
              <textarea name="doctorNotes" onChange={handleChange}></textarea>
            </div>
          </div>

          {/* Hospital Information Section */}
          <div className="form-section">
            <h3>Hospital Information</h3>
            <div className="input-group">
              <div className="form-field">
                <label>Doctor's Name</label>
                <input type="text" name="doctorName" onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Hospital Name</label>
                <input type="text" name="hospitalName" onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <div className="form-field">
                <label>Admission Date</label>
                <input type="date" name="admissionDate" onChange={handleChange} required />
              </div>
              <div className="form-field">
                <label>Discharge Date</label>
                <input type="date" name="dischargeDate" onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="button-container">
            <button type="submit">Register Patient</button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Registration Successful!</h2>
            </div>
            <div className="modal-content">
              <p>The patient has been successfully registered in the system.</p>
              <p><strong>Unique ID:</strong> {uniqueId}</p>
            </div>
            <div className="modal-actions">
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;