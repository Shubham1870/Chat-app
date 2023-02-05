import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import "./signup.css"
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await response.json();
      console.log(data.message);
     navigate("/login")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <section id="signup-container">
    <h1>Sign Up</h1>
    <div id='username'><input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /></div>
    <form onSubmit={handleSubmit}>
    <div id='email'><input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /></div>
    <div id='password'><input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /></div>
  
      <button id="signup-button" type="submit">Sign Up</button>
    </form>
    <p>Have an account?</p>
            <Link to={"/login"}> <button  id="signin-button"  >Sign In</button></Link>
    </section>
    </>
  );
};

export default SignUp;
