import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSamplePdf, getJournals, getPeriodLogs } from '../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFGenerator = () => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    menstrualHistory: '',
    medications: '',
    doctorNotes: '',
    includeJournals: true,
    includePeriodData: true,
    reportType: 'health-summary'
  });

  const [userData, setUserData] = useState({
    journals: [],
    periodLogs: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const summaryRef = useRef();

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [journalsResponse, periodLogsResponse] = await Promise.all([
        getJournals(token),
        getPeriodLogs(user?.id || 'current', token)
      ]);

      setUserData({
        journals: journalsResponse.success ? journalsResponse.data || [] : [],
        periodLogs: periodLogsResponse.success ? periodLogsResponse.data || [] : []
      });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      setError('');

      const element = summaryRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`womenline-${formData.reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodLabel = (mood) => {
    const moodLabels = {
      'happy': '😊 Happy',
      'sad': '😢 Sad',
      'anxious': '😰 Anxious',
      'angry': '😠 Angry',
      'calm': '😌 Calm',
      'excited': '🤩 Excited',
      'tired': '😴 Tired',
      'stressed': '😤 Stressed'
    };
    return moodLabels[mood] || mood;
  };

  return (
    <div className="card" style={{ maxWidth: 900 }}>
      <h2>📄 Health Report PDF Generator</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Generate comprehensive health reports and download them as PDF files
      </p>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          background: '#ffe6e6', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form Section */}
        <div>
          <h3 style={{ color: '#7b3f3f', marginBottom: '1rem' }}>Report Configuration</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Report Type:
            </label>
            <select 
              name="reportType" 
              value={formData.reportType} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            >
              <option value="health-summary">Health Summary</option>
              <option value="mental-wellness">Mental Wellness Report</option>
              <option value="period-tracking">Period Tracking Report</option>
              <option value="comprehensive">Comprehensive Health Report</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Patient Name:
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter patient name"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Age:
            </label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleChange}
              placeholder="Enter age"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Report Date:
            </label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Current Symptoms:
            </label>
            <textarea 
              name="symptoms" 
              value={formData.symptoms} 
              onChange={handleChange}
              placeholder="Describe any current symptoms..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Menstrual History:
            </label>
            <textarea 
              name="menstrualHistory" 
              value={formData.menstrualHistory} 
              onChange={handleChange}
              placeholder="Describe menstrual history..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Medications:
            </label>
            <textarea 
              name="medications" 
              value={formData.medications} 
              onChange={handleChange}
              placeholder="List current medications..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Doctor's Notes:
            </label>
            <textarea 
              name="doctorNotes" 
              value={formData.doctorNotes} 
              onChange={handleChange}
              placeholder="Add doctor's notes..."
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #b97a7a' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                name="includeJournals" 
                checked={formData.includeJournals} 
                onChange={(e) => setFormData(prev => ({ ...prev, includeJournals: e.target.checked }))}
              />
              Include Mental Wellness Journal Entries
            </label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="checkbox" 
                name="includePeriodData" 
                checked={formData.includePeriodData} 
                onChange={(e) => setFormData(prev => ({ ...prev, includePeriodData: e.target.checked }))}
              />
              Include Period Tracking Data
            </label>
          </div>

          <button 
            onClick={handleDownloadPDF}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#7b3f3f',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Generating PDF...' : '📄 Generate & Download PDF'}
          </button>
        </div>

        {/* Preview Section */}
        <div>
          <h3 style={{ color: '#7b3f3f', marginBottom: '1rem' }}>Report Preview</h3>
          
          <div 
            ref={summaryRef} 
            style={{
              backgroundColor: '#fff',
              border: '2px solid #b97a7a',
              padding: '2rem',
              borderRadius: '8px',
              minHeight: '600px',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #7b3f3f', paddingBottom: '1rem' }}>
              <h1 style={{ color: '#7b3f3f', margin: 0, fontSize: '2rem' }}>WOMENLINE</h1>
              <h2 style={{ color: '#666', margin: '0.5rem 0', fontSize: '1.5rem' }}>
                {formData.reportType === 'health-summary' && 'Health Summary Report'}
                {formData.reportType === 'mental-wellness' && 'Mental Wellness Report'}
                {formData.reportType === 'period-tracking' && 'Period Tracking Report'}
                {formData.reportType === 'comprehensive' && 'Comprehensive Health Report'}
              </h2>
              <p style={{ color: '#999', margin: 0 }}>Generated on {formatDate(formData.date)}</p>
            </div>

            {/* Patient Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                Patient Information
              </h3>
              <p><strong>Name:</strong> {formData.name || 'Not specified'}</p>
              <p><strong>Age:</strong> {formData.age || 'Not specified'}</p>
              <p><strong>Report Date:</strong> {formatDate(formData.date)}</p>
            </div>

            {/* Health Information */}
            {formData.symptoms && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Current Symptoms
                </h3>
                <p>{formData.symptoms}</p>
              </div>
            )}

            {formData.menstrualHistory && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Menstrual History
                </h3>
                <p>{formData.menstrualHistory}</p>
              </div>
            )}

            {formData.medications && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Medications
                </h3>
                <p>{formData.medications}</p>
              </div>
            )}

            {/* Mental Wellness Data */}
            {formData.includeJournals && userData.journals.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Mental Wellness Journal Entries
                </h3>
                {userData.journals.slice(0, 5).map((journal, index) => (
                  <div key={index} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                      {formatDate(journal.createdAt || Date.now())} - {getMoodLabel(journal.mood)}
                    </p>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{journal.note}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Period Tracking Data */}
            {formData.includePeriodData && userData.periodLogs.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Period Tracking Data
                </h3>
                {userData.periodLogs.slice(0, 3).map((log, index) => (
                  <div key={index} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                      {formatDate(log.startDate)} - {formatDate(log.endDate)}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Mood:</strong> {log.mood}</p>
                    {log.symptoms && log.symptoms.length > 0 && (
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Symptoms:</strong> {log.symptoms.join(', ')}</p>
                    )}
                    {log.notes && <p style={{ margin: 0, fontStyle: 'italic' }}>Notes: {log.notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Doctor's Notes */}
            {formData.doctorNotes && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#7b3f3f', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
                  Doctor's Notes
                </h3>
                <p>{formData.doctorNotes}</p>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
              <p style={{ color: '#999', margin: 0, fontSize: '0.9rem' }}>
                This report was generated by Womenline - Empowering Women's Health
              </p>
              <p style={{ color: '#999', margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
                © 2025 Womenline Project | Made with ❤️ for Women
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h4 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>💡 PDF Generation Tips</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#333' }}>
          <li>Fill in all relevant information for a comprehensive report</li>
          <li>Include journal entries and period data for better insights</li>
          <li>Review the preview before generating the PDF</li>
          <li>Save the PDF for your medical records or doctor visits</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFGenerator; 