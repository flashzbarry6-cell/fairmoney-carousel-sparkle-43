import React, { useEffect, useState } from 'react';

const WithdrawResult = () => {
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    // You might fetch from backend whether it succeeded or not.
    // For demo, randomly choose success or failure:
    const ok = Math.random() > 0.2;
    setTimeout(() => setSuccess(ok), 1000);
  }, []);

  return (
    <div style={styles.container}>
      {success ? (
        <>
          <h2 style={styles.title}>Withdrawal Successful</h2>
          <p style={styles.text}>Your funds are on the way.</p>
        </>
      ) : (
        <>
          <h2 style={styles.title}>Withdrawal Failed</h2>
          <p style={styles.text}>We could not process your request. Please try later.</p>
        </>
      )}
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
  title: { fontSize: '24px', marginBottom: '15px' },
  text: { fontSize: '18px' },
};

export default WithdrawResult;
