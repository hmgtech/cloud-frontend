import React, { useState } from 'react';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const inputStyle: React.CSSProperties = {
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '8px',
    fontSize: '16px',
    color: 'black', // Changed text color to black
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password must match.');
      return;
    }

    try {
      const response = await fetch('http:// 3.89.195.15/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Set token to localStorage
        localStorage.setItem('token', token);

        // Redirect user to "/"
        window.location.href = "/";
      } else {
        console.error('Signup failed');
        // Handle failure scenario
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error scenario
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        placeholder="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        style={inputStyle}
        placeholder="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        style={inputStyle}
        placeholder="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        style={inputStyle}
        placeholder="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      <button style={buttonStyle} type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
