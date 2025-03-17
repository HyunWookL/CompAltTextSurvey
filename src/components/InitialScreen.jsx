import React from 'react';

function InitialScreen({ onStart }) {
  return (
    <div
      style={{
        maxWidth: '800px',
        height: '100%',
        marginTop: '30px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        textAlign: 'left',
        // backgroundColor: '#f0f8ff',
      }}
    >
      <h1 style={{ textAlign: 'left', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        📢 Introduction & Participation Guidelines
      </h1>
      <p style={{ fontSize: '16px', color: '#555' }}>
        This survey is intended only for participants who can interpret charts. Please note that you will not be able to proceed if you fail the qualification test at the beginning.
      </p>
      {/* <br/> */}
      <p style={{ fontSize: '16px', color: '#555' }}>
        This study explores how people perceive prominent regions in visualizations and has been approved by IRB (UNISTIRB-25-008-C).
      </p>

      <h2 style={{ color: '#222', marginTop: '30px' }}>⚠️ Participation Restrictions</h2>
      <p style={{ fontSize: '16px', color: '#555', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '5px' }}>
        Failure to follow these rules will result in disqualification from compensation.
      </p>

      <h3 style={{ color: '#333', marginTop: '20px' }}>✅ Device Requirement:</h3>
      <ul style={{ paddingLeft: '20px', color: '#555' }}>
        <li>You must use a desktop or laptop computer.</li>
        <li>Smartphones, tablets, and other mobile devices are <strong>NOT</strong> allowed.</li>
        <li>We will collect your device type (e.g., product name, operating system, screen size).</li>
        <li>Unauthorized devices will not receive compensation.</li>
        <li>Screen size must be fixed during the survey. Do not resize the window, zoom in or out, or change your screen settings while participating.</li>
      </ul>

      <h3 style={{ color: '#333', marginTop: '20px' }}>✅ Response Requirement:</h3>
      <p style={{ fontSize: '16px', color: '#555', backgroundColor: '#f8f8f8', padding: '10px', borderRadius: '5px' }}>
        Your open-ended response must be at least <strong>50 characters</strong> long.
      </p>

      <h2 style={{ color: '#222', marginTop: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        ⚠️ CAUTION: Rules & Compensation Policy
      </h2>

      <h3 style={{ color: '#c00', marginTop: '20px' }}>🚫 Prohibited Actions:</h3>
      <ul style={{ paddingLeft: '20px', color: '#555' }}>
        <li>Using the <strong>Back</strong> or <strong>Refresh</strong> buttons in your browser.</li>
        <li>Opening a new tab or window.</li>
        <li>Using an unauthorized device (e.g., smartphone, tablet).</li>
        <li>Resizing your screen or changing display settings during the survey.</li>
        <li>Quitting the survey before completing all tasks. (If you exit early, your responses will not be collected, and you will not receive compensation.)</li>
      </ul>

      <h3 style={{ color: '#228B22', marginTop: '20px' }}>💰 Compensation Policy</h3>

      <h4 style={{ color: '#d9534f' }}>🔴 No Compensation if:</h4>
      <ul style={{ paddingLeft: '20px', color: '#555' }}>
        <li>You violate any prohibited actions listed above.</li>
      </ul>

      <h4 style={{ color: '#f0ad4e' }}>🟠 Partial / Prorated Compensation if:</h4>
      <ul style={{ paddingLeft: '20px', color: '#555' }}>
        <li>You remain idle for too long.</li>
        <li>Your response contains non-English characters.</li>
        <li>You submit inappropriate responses (e.g., random characters, irrelevant text).</li>
      </ul>

      <h4 style={{ color: '#5cb85c' }}>🟢 Full Compensation if:</h4>
      <ul style={{ paddingLeft: '20px', color: '#555' }}>
        <li>You complete all tasks without violating any rules above.</li>
      </ul>

      <p style={{ fontSize: '16px', color: '#555', backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
        By continuing, you confirm that you have read and agree to the participation and compensation policies.
      </p>


      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '50px', paddingBottom: '50px' }}>
        <button onClick={onStart}>
          AGREE & START
        </button>
      </div>
    </div>
  );
}

export default InitialScreen;
