import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineUser, AiOutlineIdcard } from 'react-icons/ai';
import './SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `http://localhost:4000/api/medical-records/search?query=${searchTerm}`
      );

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
  };

  const getStatusIndicator = (record) => {
    const hasDischarge = record.dischargeDate && record.dischargeDate.trim() !== '';
    return hasDischarge ? (
      <span className="status-indicator discharged">Discharged</span>
    ) : (
      <span className="status-indicator active">Active</span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ongoing Treatment';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            <span className="search-icon">
              <AiOutlineSearch />
            </span>
            <input
              type="text"
              placeholder="Enter Unique ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
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
          <button className="try-again-btn" onClick={() => setSearchTerm('')}>
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
                    <span className="patient-id">
                      <AiOutlineIdcard /> {record.uniqueId}
                    </span>
                    {getStatusIndicator(record)}
                  </div>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => setSelectedRecord(record)}
                >
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
              <button className="modal-close-btn" onClick={handleModalClose}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="patient-summary">
                <div className="patient-avatar">
                  <AiOutlineUser size={48} />
                </div>
                <div className="patient-overview">
                  <h4>{selectedRecord.patientName}</h4>
                  <div className="patient-meta-details">
                    <span>
                      <AiOutlineIdcard /> {selectedRecord.uniqueId}
                    </span>
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
                      <span>
                        {selectedRecord.diagnosis || 'No diagnosis recorded'}
                      </span>
                    </div>
                    <div className="record-field full-width">
                      <strong>Treatment</strong>
                      <span>
                        {selectedRecord.treatment || 'No treatment recorded'}
                      </span>
                    </div>
                    <div className="record-field full-width">
                      <strong>Medications</strong>
                      <span>
                        {selectedRecord.medications || 'No medications recorded'}
                      </span>
                    </div>
                    <div className="record-field full-width">
                      <strong>Doctor's Notes</strong>
                      <span>
                        {selectedRecord.doctorNotes || 'No notes recorded'}
                      </span>
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
                      <span>
                        {formatDate(selectedRecord.dischargeDate) || 'Not discharged'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;