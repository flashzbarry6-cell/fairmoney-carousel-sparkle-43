import React from 'react';
import { useNavigate } from 'react-router-dom';

const WithdrawReceipt = () => {
  const navigate = useNavigate();
  const info = JSON.parse(localStorage.getItem('withdrawInfo') || '{}');

  const handleProceed = () => {
    navigate('/withdraw-process');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Withdraw Pending</h2>
      <div style={styles.infoBox}>
        <p>Bank: {info.bank}</p>
        <p>Account Name: {info.accountName}</p>
        <p>Account Number: {info.accountNumber}</p>
        <p>Amount: ₦{info.amount?.toLocaleString()}</p>
        {/* maybe more */}
      </div>
      <button style={styles.button} onClick={handleProceed}>Proceed</button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1E1B2E',
    minHeight: '100vh',
    color: '#fff',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: { fontSize: '24px', marginBottom: '20px' },
  infoBox: {
    backgroundColor: '#3A2F4D',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '400px',
    color: '#fff',
    fontSize: '16px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#9C27B0',
    color: '#fff',
  },
};

export default WithdrawReceipt;
