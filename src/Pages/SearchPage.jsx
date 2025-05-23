import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineUser, AiOutlineIdcard } from 'react-icons/ai';
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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/medical-records/search?query=${encodeURIComponent(searchTerm)}`
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
    setIsEditing(false);
    setUpdateSuccess('');
    setUpdateError('');
  };

  const getStatusIndicator = (record) => {
    if (record.dischargeDate && record.dischargeDate.trim() !== '') {
      const discharge = new Date(record.dischargeDate);
      const today = new Date();
      discharge.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (discharge <= today) {
        return <span className="status-indicator discharged">Discharged</span>;
      }
    }
    return <span className="status-indicator active">Active</span>;
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
        contactNumber: editFormData.contactNumber || editFormData.contact,
      };

      if (formDataToSubmit.contact) {
        delete formDataToSubmit.contact;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/medical-records/${selectedRecord._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formDataToSubmit),
        }
      );

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
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
    if (
      window.confirm(
        'Are you sure you want to delete this record? This action cannot be undone.'
      )
    ) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/medical-records/${selectedRecord._id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setRecords(records.filter((record) => record._id !== selectedRecord._id));
          setSelectedRecord(null);
          const notification = document.createElement('div');
          notification.className = 'delete-notification';
          notification.textContent = 'Record deleted successfully';
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 3000);
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
          <h3 className="results-title">
            Found {records.length} patient record(s)
          </h3>
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Patient Details</h3>
              <div className="modal-actions">
                {!isEditing && (
                  <>
                    <button className="edit-btn" onClick={handleEditClick}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={handleDeleteClick}>
                      Delete
                    </button>
                  </>
                )}
                <button
                  className="modal-close-btn"
                  onClick={handleModalClose}
                >
                  &times;
                </button>
              </div>
            </div>

            {updateSuccess && (
              <div className="success-message">{updateSuccess}</div>
            )}
            {updateError && (
              <div className="error-message">{updateError}</div>
            )}

            <div className="modal-body">
              {isEditing ? (
                <form onSubmit={handleEditFormSubmit} className="edit-form">
                  {/* ...form fields as in your original code... */}
                  {/* For brevity, keep your existing form fields here */}
                  {/* ... */}
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
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
                        <span>
                          <AiOutlineIdcard /> {selectedRecord.uniqueId}
                        </span>
                        <span>{selectedRecord.age} years</span>
                        <span>{selectedRecord.gender}</span>
                        {getStatusIndicator(selectedRecord)}
                      </div>
                    </div>
                  </div>
                  {/* ...rest of the details as in your original code... */}
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