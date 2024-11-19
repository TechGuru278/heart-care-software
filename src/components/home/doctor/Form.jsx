import React, { useState } from 'react';
import './form.scss';

const HealthForm = () => {
  const [formData, setFormData] = useState({
    name: '', // Added name field
    age: '',
    sex: '',
    cp: '',
    bp: '',
    cholesterol: '',
    sugar: '',
    ecg: '',
    heartRate: '',
  });

  const [showECGImage, setShowECGImage] = useState(false);
  const [risk, setRisk] = useState(null);
  const [summary, setSummary] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          ecg: reader.result, // Store the image data as base64 string
        }));
      };
      reader.readAsDataURL(file); // Read the file as base64 string
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Form Submitted Successfully!');
    if (formData.ecg) {
      setShowECGImage(true); // Display ECG image after submission
    }
    checkHeartRisk(); // Check the risk after form submission
    generateSummary(); // Generate summary based on input data
  };

  const checkHeartRisk = () => {
    let riskStatus = 'Low Risk'; // Default risk status

    // Logic to check for heart problems based on inputs
    if (formData.cp === 'yes') {
      riskStatus = 'High Risk (Chest pain detected)';
    }
    if (formData.bp > 140) {
      riskStatus = 'High Risk (High Blood Pressure)';
    }
    if (formData.cholesterol > 200) {
      riskStatus = 'High Risk (High Cholesterol)';
    }
    if (formData.sugar > 100) {
      riskStatus = 'High Risk (High Blood Sugar)';
    }
    if (formData.heartRate < 60 || formData.heartRate > 100) {
      riskStatus = 'High Risk (Abnormal Heart Rate)';
    }

    setRisk(riskStatus); // Update the risk state
  };

  const generateSummary = () => {
    let healthSummary = '';

    // Check chest pain (CP)
    if (formData.cp === 'yes') {
      healthSummary += 'You may be experiencing chest pain, which could indicate a heart problem. It is strongly recommended to consult a healthcare provider immediately.\n';
    }

    // Check blood pressure (BP)
    if (formData.bp > 140) {
      healthSummary += 'High blood pressure detected. You should monitor your blood pressure regularly and consult a doctor. Lifestyle changes like a balanced diet, exercise, and medication may help manage it.\n';
    }

    // Check cholesterol levels
    if (formData.cholesterol > 200) {
      healthSummary += 'High cholesterol levels detected. It is advisable to reduce dietary fats, exercise regularly, and consult your healthcare provider for advice on managing cholesterol.\n';
    }

    // Check blood sugar levels
    if (formData.sugar > 100) {
      healthSummary += 'High blood sugar levels detected. A healthy diet, regular exercise, and weight management can help. If symptoms persist, please consult a doctor.\n';
    }

    // Check heart rate
    if (formData.heartRate < 60 || formData.heartRate > 100) {
      healthSummary += 'Abnormal heart rate detected. If your heart rate is consistently too low or too high, consult a healthcare provider to assess the cause and explore treatment options.\n';
    }

    // If no major issues detected, provide general wellness advice
    if (!healthSummary) {
      healthSummary = 'Your health data seems normal. However, maintaining a balanced diet, regular physical activity, and routine health checkups are recommended for overall well-being.\n';
    }

    setSummary(healthSummary); // Update the summary state
  };

  return (
    <div className="health-form-container">
      <form className="health-form" onSubmit={handleSubmit}>
        <h1>Patient Information</h1>

        {/* Name Field */}
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="Enter your age"
          />
        </label>

        <label>
          Sex:
          <select name="sex" className="sex" value={formData.sex} onChange={handleChange} required>
            <option value="" disabled>
              Select your sex
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Chest Pain Type (CP):
          <select
            name="cp"
            value={formData.cp}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Yes or No
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label>
          Blood Pressure (BP):
          <input
            type="number"
            name="bp"
            value={formData.bp}
            onChange={handleChange}
            required
            placeholder="Enter BP"
          />
        </label>

        <label>
          Cholesterol:
          <input
            type="number"
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleChange}
            required
            placeholder="Enter cholesterol level"
          />
        </label>

        <label>
          Sugar:
          <input
            type="number"
            name="sugar"
            value={formData.sugar}
            onChange={handleChange}
            required
            placeholder="Enter sugar level"
          />
        </label>

        {/* ECG File Input */}
        <label>
          ECG (Upload Image):
          <input
            type="file"
            name="ecg"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>

        <label>
          Heart Rate:
          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            required
            placeholder="Enter heart rate"
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {/* Conditionally render ECG image */}
      {showECGImage && formData.ecg && (
        <div className="ecg-image-container">
          <h2>ECG Estimation</h2>
          <img src={formData.ecg} alt="ECG Result" className="ecg-image" />
        </div>
      )}

      {/* Conditionally render the table with form data, excluding ECG */}
      {showECGImage && (
        <div className="table-container">
          <center><h2>Final Report</h2></center>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(formData)
                .filter(([key]) => key !== 'ecg') // Exclude the ECG field
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display heart risk status */}
      {risk && (
        <div className="risk-status">
          <h3>Heart Risk Status: {risk}</h3>
        </div>
      )}

      {/* Display health summary and recommendations */}
      {summary && (
        <div className="health-summary">
          <h3>Health Summary and Recommendations:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default HealthForm;
