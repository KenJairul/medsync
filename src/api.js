const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchPatients = async () => {
  try {
    const response = await fetch(`${API_URL}/api/patients`);
    if (!response.ok) throw new Error("Failed to fetch patients");
    return await response.json();
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

export const registerPatient = async (patientData) => {
  try {
    const response = await fetch(`${API_URL}/api/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error registering patient:", error);
    return null;
  }
};
