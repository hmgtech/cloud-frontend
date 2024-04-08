import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle: React.CSSProperties = {
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '8px',
    fontSize: '16px',
    color: "black"
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('http://3.89.195.15/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      // Redirect to dashboard page
      window.location.href = '/';
    } catch (error) {
      // Handle error here, for example:
      console.error(error.message);
      // Display an error message to the user
      // toast.error(error.message);
    }
  };


  return (
    <>
      <form onSubmit={handleLogin}>
        <input
          style={inputStyle}
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Login;
