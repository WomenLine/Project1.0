import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './HealthSummaryPDF.css';

const HealthSummaryPDF = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    date: '',
    symptoms: '',
    menstrualHistory: '',
    medications: '',
    doctorNotes: '',
  });

  const summaryRef = useRef();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDownloadPDF = async () => {
    try {
      const element = summaryRef.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('health-summary.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="health-summary-container">
      <div className="health-summary-header">
        <h2 className="health-summary-title">🏥 Gynecologist Visit - Health Summary Generator</h2>
        <p className="health-summary-subtitle">Create a comprehensive health summary for your gynecologist visit</p>
      </div>

      <div className="health-summary-form">
        <div className="form-group">
          <label htmlFor="name">Patient Name:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="Enter patient name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input 
            type="number" 
            id="age"
            name="age" 
            value={formData.age} 
            onChange={handleChange}
            placeholder="Enter age"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Visit Date:</label>
          <input 
            type="date" 
            id="date"
            name="date" 
            value={formData.date} 
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Symptoms:</label>
          <textarea 
            id="symptoms"
            name="symptoms" 
            value={formData.symptoms} 
            onChange={handleChange}
            placeholder="Describe your symptoms..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="menstrualHistory">Menstrual History:</label>
          <textarea 
            id="menstrualHistory"
            name="menstrualHistory" 
            value={formData.menstrualHistory} 
            onChange={handleChange}
            placeholder="Describe your menstrual cycle, any irregularities..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="medications">Current Medications:</label>
          <textarea 
            id="medications"
            name="medications" 
            value={formData.medications} 
            onChange={handleChange}
            placeholder="List any medications you're currently taking..."
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="doctorNotes">Additional Notes for Doctor:</label>
          <textarea 
            id="doctorNotes"
            name="doctorNotes" 
            value={formData.doctorNotes} 
            onChange={handleChange}
            placeholder="Any additional information you want to share with your doctor..."
            rows="4"
          ></textarea>
        </div>

        <button 
          className="generate-pdf-btn"
          onClick={handleDownloadPDF}
          disabled={!formData.name || !formData.age || !formData.date}
        >
          📄 Generate Health Summary PDF
        </button>
      </div>

      {/* PDF Preview Section */}
      <div className="pdf-preview-section">
        <h3 className="preview-title">📋 PDF Preview</h3>
        <div className="pdf-preview" ref={summaryRef}>
          <div className="pdf-header">
            <h1 className="pdf-main-title">Health Summary Report</h1>
            <div className="pdf-info">
              <p><strong>Generated Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Report Type:</strong> Gynecologist Visit Summary</p>
            </div>
          </div>

          <div className="pdf-content">
            <div className="patient-info">
              <h2>Patient Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Name:</strong> {formData.name || 'Not specified'}
                </div>
                <div className="info-item">
                  <strong>Age:</strong> {formData.age || 'Not specified'}
                </div>
                <div className="info-item">
                  <strong>Visit Date:</strong> {formData.date || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="symptoms-section">
              <h2>Symptoms</h2>
              <p className="symptoms-text">
                {formData.symptoms || 'No symptoms reported'}
              </p>
            </div>

            <div className="menstrual-section">
              <h2>Menstrual History</h2>
              <p className="menstrual-text">
                {formData.menstrualHistory || 'No menstrual history provided'}
              </p>
            </div>

            <div className="medications-section">
              <h2>Current Medications</h2>
              <p className="medications-text">
                {formData.medications || 'No medications reported'}
              </p>
            </div>

            <div className="notes-section">
              <h2>Additional Notes</h2>
              <p className="notes-text">
                {formData.doctorNotes || 'No additional notes provided'}
              </p>
            </div>

            <div className="pdf-footer">
              <p><em>This report was generated by Womenline Health Summary Generator</em></p>
              <p><em>Please review all information before sharing with your healthcare provider</em></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSummaryPDF; 