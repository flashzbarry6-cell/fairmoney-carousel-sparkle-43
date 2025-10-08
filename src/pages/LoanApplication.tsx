import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoanPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isLoanTaken, setIsLoanTaken] = useState(false);

  useEffect(() => {
    const lastLoanTime = localStorage.getItem('lastLoanTime');
    if (lastLoanTime) {
      const now = new Date();
      const loanTime = new Date(lastLoanTime);
      const diffDays = Math.floor((now - loanTime) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        setIsLoanTaken(true);
      } else {
        localStorage.removeItem('lastLoanTime');
      }
    }
  }, []);

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

    setError('');
    localStorage.setItem('lastLoanTime', new Date().toISOString());
    localStorage.setItem('loanAmount', num);
    setIsLoanTaken(true);

    // Navigate to dashboard
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
        disabled={isLoanTaken}
      />
      <input
        style={styles.input}
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoanTaken}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Loan Amount (₦20,000 - ₦50,000)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isLoanTaken}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={{
          ...styles.button,
          backgroundColor: isLoanTaken ? '#555' : '#9C27B0',
          cursor: isLoanTaken ? 'not-allowed' : 'pointer',
        }}
        onClick={handleProceed}
        disabled={isLoanTaken}
      >
        {isLoanTaken ? 'Loan Locked' : 'Proceed'}
      </button>

      {isLoanTaken && (
        <div style={styles.notification} className="animated-notification">
          🎉 Next loan available in 7 days
        </div>
      )}
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
    fontSize: '24px',
    marginBottom: '20px',
  },
  input: {
    backgroundColor: '#3A2F4D',
    color: '#fff',
    border: 'none',
    padding: '12px',
    marginBottom: '15px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '5px',
    fontSize: '16px',
  },
  button: {
    padding: '12px 25px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  notification: {
    marginTop: '25px',
    padding: '15px 20px',
    backgroundColor: '#3A2F4D',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '16px',
    animation: 'fadeInSlide 1s ease-in-out',
  },
};

export default LoanPage;
