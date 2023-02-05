import React, { useState } from 'react';

import { Link, useNavigate} from 'react-router-dom';

import "./signin.css"
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://chat-app-050m.onrender.com/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
     
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
   navigate("/join")
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <section id="signin-container">
    <h1>Sign In</h1>
    <form onSubmit={handleSubmit}>
    
      <div id='email' >  <input
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
      <button id="signin-button" type="submit">Sign In</button>
      <p>Don't have an account?</p>
<Link to={"/register"}>
<button id="signup-button">Sign Up</button>
</Link>
    </form>
    </section>
    </>
  );
};

export default SignIn;
