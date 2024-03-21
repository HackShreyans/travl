import React from 'react'
import "../styles/Landing.css";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-main'>
    <h1>Embark on Your Next Adventure with Us</h1>
    <p>Join us as we explore the world one step at a time</p>
    <Link to="/login" className="landing-login-button">Login</Link>
    <Link to="/register" className="landing-register-button">Register</Link>
  </div>
  )
}

export default Landing