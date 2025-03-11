import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineUser, AiOutlineIdcard, AiOutlineCalendar, AiOutlineMedicineBox } from 'react-icons/ai';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:4000/api/medical-records/search?query=${searchTerm}`);

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setRecords(data);
        } else {
          setRecords([]);
          setErrorMessage('No records found');
        }
      } else {
        setRecords([]);
        setErrorMessage('No records found');
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setErrorMessage('Failed to fetch records. Please try again later.');
    }

    setLoading(false);
  };

  const handleModalClose = () => {
    setSelectedRecord(null);
    setIsEditing(false);
    setUpdateSuccess('');
    setUpdateError('');
  };

  const getStatusIndicator = (record) => {
    const hasDischarge = record.dischargeDate && record.dischargeDate.trim() !== '';
    return hasDischarge ? 
      <span className="status-indicator discharged">Discharged</span> : 
      <span className="status-indicator active">Active</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing Treatment';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditFormData({ ...selectedRecord });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess('');
    setUpdateError('');

    try {
      const formDataToSubmit = {
        ...editFormData,
        contactNumber: editFormData.contactNumber || editFormData.contact
      };

      if (formDataToSubmit.contact) {
        delete formDataToSubmit.contact;
      }

      console.log('Submitting data:', formDataToSubmit);

      const response = await fetch(`http://localhost:4000/api/medical-records/${selectedRecord.uniqueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.uniqueId === selectedRecord.uniqueId ? updatedRecord : record
          )
        );
        setSelectedRecord(updatedRecord);
        setIsEditing(false);
        setUpdateSuccess('Record updated successfully!');
      } else {
        const errorData = await response.json();
        setUpdateError(errorData.message || 'Failed to update record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      setUpdateError('Error connecting to server. Please try again.');
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:4000/api/medical-records/${selectedRecord.uniqueId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRecords(records.filter(record => record.uniqueId !== selectedRecord.uniqueId));
          setSelectedRecord(null);
          alert('Record deleted successfully');
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error connecting to server. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError('');
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <div className="search-header">
          <h2>Search Patient Records</h2>
          <p>Search by Unique ID or Patient Name</p>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <span className="search-icon"><AiOutlineSearch /></span>
            <input
              type="text"
              placeholder="Enter Unique ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        </form>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Searching patient records...</p>
        </div>
      )}

      {errorMessage && (
        <div className="no-results">
          <p>{errorMessage}</p>
          <button 
            className="try-again-btn"
            onClick={() => setSearchTerm('')}
          >
            Try a different search
          </button>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="results-container">
          <h3 className="results-title">Found {records.length} patient record(s)</h3>
          {records.map((record) => (
            <div key={record.uniqueId} className="result-card">
              <div className="result-header">
                <div className="patient-info">
                  <h4>{record.patientName}</h4>
                  <div className="patient-meta">
                    <span className="patient-id"><AiOutlineIdcard /> {record.uniqueId}</span>
                    {getStatusIndicator(record)}
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => setSelectedRecord(record)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecord && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Details</h3>
              <div className="modal-actions">
                {!isEditing && (
                  <>
                    <button className="edit-btn" onClick={handleEditClick}>Edit</button>
                    <button className="delete-btn" onClick={handleDeleteClick}>Delete</button>
                  </>
                )}
                <button className="modal-close-btn" onClick={handleModalClose}>&times;</button>
              </div>
            </div>
            
            {updateSuccess && <div className="success-message">{updateSuccess}</div>}
            {updateError && <div className="error-message">{updateError}</div>}
            
            <div className="modal-body">
              {isEditing ? (
                <form onSubmit={handleEditFormSubmit} className="edit-form">
                  <div className="form-group">
                    <label>Patient Name:</label>
                    <input
                      type="text"
                      name="patientName"
                      value={editFormData.patientName || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Age:</label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender:</label>
                    <select
                      name="gender"
                      value={editFormData.gender || ''}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Contact Number:</label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={editFormData.contactNumber || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address:</label>
                    <textarea
                      name="address"
                      value={editFormData.address || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Type:</label>
                    <select
                      name="bloodType"
                      value={editFormData.bloodType || ''}
                      onChange={handleEditFormChange}
                    >
                      <option value="">Select blood type</option>
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
                  <div className="form-group">
                    <label>Diagnosis:</label>
                    <textarea
                      name="diagnosis"
                      value={editFormData.diagnosis || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Treatment:</label>
                    <textarea
                      name="treatment"
                      value={editFormData.treatment || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Medications:</label>
                    <textarea
                      name="medications"
                      value={editFormData.medications || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Doctor's Name:</label>
                    <input
                      type="text"
                      name="doctorName"
                      value={editFormData.doctorName || ''}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Doctor's Notes:</label>
                    <textarea
                      name="doctorNotes"
                      value={editFormData.doctorNotes || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hospital Name:</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={editFormData.hospitalName || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admission Date:</label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={editFormData.admissionDate ? new Date(editFormData.admissionDate).toISOString().split('T')[0] : ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Discharge Date:</label>
                    <input
                      type="date"
                      name="dischargeDate"
                      value={editFormData.dischargeDate ? new Date(editFormData.dischargeDate).toISOString().split('T')[0] : ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Allergies:</label>
                    <textarea
                      name="allergies"
                      value={editFormData.allergies || ''}
                      onChange={handleEditFormChange}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="patient-summary">
                    <div className="patient-avatar">
                      <AiOutlineUser size={48} />
                    </div>
                    <div className="patient-overview">
                      <h4>{selectedRecord.patientName}</h4>
                      <div className="patient-meta-details">
                        <span><AiOutlineIdcard /> {selectedRecord.uniqueId}</span>
                        <span>{selectedRecord.age} years</span>
                        <span>{selectedRecord.gender}</span>
                        {getStatusIndicator(selectedRecord)}
                      </div>
                    </div>
                  </div>
                  <div className="record-sections">
                    <div className="record-section">
                      <h5 className="section-title">Personal Information</h5>
                      <div className="record-details">
                        <div className="record-field">
                          <strong>Contact</strong>
                          <span>{selectedRecord.contactNumber || 'Not provided'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Address</strong>
                          <span>{selectedRecord.address || 'Not provided'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Blood Type</strong>
                          <span>{selectedRecord.bloodType || 'Not recorded'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Allergies</strong>
                          <span>{selectedRecord.allergies || 'None reported'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="record-section">
                      <h5 className="section-title">Medical Information</h5>
                      <div className="record-details">
                        <div className="record-field full-width">
                          <strong>Diagnosis</strong>
                          <span>{selectedRecord.diagnosis || 'No diagnosis recorded'}</span>
                        </div>
                        <div className="record-field full-width">
                          <strong>Treatment</strong>
                          <span>{selectedRecord.treatment || 'No treatment recorded'}</span>
                        </div>
                        <div className="record-field full-width">
                          <strong>Medications</strong>
                          <span>{selectedRecord.medications || 'No medications recorded'}</span>
                        </div>
                        <div className="record-field full-width">
                          <strong>Doctor's Notes</strong>
                          <span>{selectedRecord.doctorNotes || 'No notes recorded'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="record-section">
                      <h5 className="section-title">Hospital Details</h5>
                      <div className="record-details">
                        <div className="record-field">
                          <strong>Doctor's Name</strong>
                          <span>{selectedRecord.doctorName || 'Not assigned'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Hospital Name</strong>
                          <span>{selectedRecord.hospitalName || 'Not recorded'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Admission Date</strong>
                          <span>{formatDate(selectedRecord.admissionDate)}</span>
                        </div>
                        <div className="record-field">
                          <strong>Discharge Date</strong>
                          <span>{formatDate(selectedRecord.dischargeDate) || 'Not discharged'}</span>
                        </div>
                        <div className="record-field">
                          <strong>Date of Visit</strong>
                          <span>{formatDate(selectedRecord.dateOfVisit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;