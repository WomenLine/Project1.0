import React from "react";

const HealthData = () => (
  <div className="card" style={{ maxWidth: 700 }}>
    <h2 style={{ textAlign: 'center', color: '#7b3f3f', marginBottom: 24 }}>Personal & Health Form</h2>
    <form className="health-form">
      <div className="form-section">
        <h3>Personal Details</h3>
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" type="text" placeholder="Enter your Name" required />
        <label htmlFor="age">Age</label>
        <input id="age" type="number" placeholder="Enter your age" required />
        <label htmlFor="email">Email Id</label>
        <input id="email" type="email" placeholder="Enter the E-mail id" required />
        <label htmlFor="altEmail">Alternate Email</label>
        <input id="altEmail" type="email" placeholder="Enter the alternate email id if any" />
        <label htmlFor="contact">Contact Number</label>
        <input id="contact" type="tel" placeholder="Enter your contact details" required />
        <label htmlFor="altContact">Alternate Contact Number</label>
        <input id="altContact" type="tel" placeholder="Enter alternate contact number" />
        <label htmlFor="address">Address</label>
        <input id="address" type="text" placeholder="Enter your address" />
        <label htmlFor="bloodGroup">Blood Group</label>
        <select id="bloodGroup" required>
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </div>
      <div className="form-section">
        <h3>Health Information</h3>
        <label htmlFor="prevHealth">Previous Health Conditions</label>
        <textarea id="prevHealth" placeholder="Describe any previous health conditions" rows={2} />
        <label htmlFor="existingHealth">Existing Health Conditions</label>
        <textarea id="existingHealth" placeholder="Describe any existing health conditions" rows={2} />
        <label htmlFor="medications">Current Medications</label>
        <textarea id="medications" placeholder="List any current medications" rows={2} />
        <label>Do you have any allergies?</label>
        <div className="health-radio-group">
          <label><input type="radio" name="allergies" value="yes" /> Yes</label>
          <label><input type="radio" name="allergies" value="no" /> No</label>
        </div>
        <label htmlFor="allergyDetails">Allergy Details (if any)</label>
        <input id="allergyDetails" type="text" placeholder="Describe allergies if any" />
      </div>
      <div className="form-section">
        <h3>Menstrual Health</h3>
        <label htmlFor="cycleLength">Average Cycle Length (in days)</label>
        <input id="cycleLength" type="number" placeholder="Enter average cycle length" />
        <label htmlFor="lastPeriod">Date of Last Period</label>
        <input id="lastPeriod" type="date" />
        <label htmlFor="periodDuration">Period Duration (in days)</label>
        <input id="periodDuration" type="number" placeholder="Enter period duration" />
        <label>Do you experience irregular periods?</label>
        <div className="health-radio-group">
          <label><input type="radio" name="irregularPeriods" value="yes" /> Yes</label>
          <label><input type="radio" name="irregularPeriods" value="no" /> No</label>
        </div>
        <label>Do you experience severe cramps?</label>
        <div className="health-radio-group">
          <label><input type="radio" name="severeCramps" value="yes" /> Yes</label>
          <label><input type="radio" name="severeCramps" value="no" /> No</label>
        </div>
        <label>Do you track your cycle?</label>
        <div className="health-radio-group">
          <label><input type="radio" name="trackCycle" value="yes" /> Yes</label>
          <label><input type="radio" name="trackCycle" value="no" /> No</label>
        </div>
        <label>Do you experience mood swings?</label>
        <div className="health-radio-group">
          <label><input type="radio" name="moodSwings" value="yes" /> Yes</label>
          <label><input type="radio" name="moodSwings" value="no" /> No</label>
        </div>
        <label htmlFor="notes">Additional Notes</label>
        <textarea id="notes" placeholder="Add any additional notes here" rows={2} />
      </div>
      <button type="submit" style={{ width: '100%', marginTop: 8 }}>Submit Form</button>
    </form>
  </div>
);

export default HealthData; 