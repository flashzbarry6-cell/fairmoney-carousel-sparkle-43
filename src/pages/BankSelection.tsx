import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BankSelect = () => {
  const navigate = useNavigate();
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const bal = parseFloat(localStorage.getItem('userBalance') || '0');
    setBalance(bal);
  }, []);

  const handleCashOut = () => {
    if (!bank || !accountName || !accountNumber) {
      setError('Fill all bank details');
      return;
    }
    if (balance <= 0) {
      setError('Insufficient balance');
      return;
    }
    // pass data to receipt page
    const details = { bank, accountName, accountNumber, amount: balance };
    // you might want to store this temporarily
    localStorage.setItem('withdrawInfo', JSON.stringify(details));
    navigate('/withdraw-receipt');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bank Details</h2>
      <p style={styles.text}>You can withdraw: ₦{balance.toLocaleString()}</p>

      <select
        style={styles.select}
        value={bank}
        onChange={(e) => setBank(e.target.value)}
      >
        <option value="">Select Bank</option>
        <option value="Opay">Opay</option>
        <option value="First Bank">First Bank</option>
        <option value="GTBank">GTBank</option>
        {/* add others */}
      </select>

      <input
        style={styles.input}
        type="text"
        placeholder="Account Name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={handleCashOut}>
        Cash Out
      </button>
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
  text: { fontSize: '18px', marginBottom: '15px' },
  select: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '15px',
    fontSize: '16px',
    backgroundColor: '#3A2F4D',
    color: '#fff',
    border: 'none',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3A2F4D',
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
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default BankSelect;
