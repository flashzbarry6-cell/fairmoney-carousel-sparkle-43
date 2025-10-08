import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoanPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProceed = () => {
    const num = parseFloat(amount);
    if (!name || !email || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(num) || num < 20000 || num > 50000) {
      setError('Loan must be between ₦20,000 and ₦50,000.');
      return;
    }

    // Clear error
    setError('');

    // Redirect to dashboard and pass the loan amount
    navigate(`/dashboard?amount=${num}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Apply for a Loan</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={styles.input}
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Loan Amount (₦20,000 - ₦50,000)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.button} onClick={handleProceed}>Proceed</button>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1E1B2E',
    minHeight: '100vh',
    color: 'white',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3A2F4D',
    color: 'white',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#9C27B0',
    color: 'white',
    padding: '12px 25px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default LoanPage;
