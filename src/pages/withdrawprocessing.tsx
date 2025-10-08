import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WithdrawProcessing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // After a delay (e.g. 3s) navigate to result
    const timer = setTimeout(() => {
      navigate('/withdraw-result');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div className="bank-animation" style={styles.animBox}>
        {/* You can style this div or embed SVG / CSS animation */}
      </div>
      <p style={styles.text}>Processing your withdrawal…</p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1E1B2E',
    minHeight: '100vh',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animBox: {
    width: '80px',
    height: '80px',
    border: '5px solid #9C27B0',
    borderTop: '5px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  text: {
    fontSize: '18px',
  },
};

export default WithdrawProcessing;
