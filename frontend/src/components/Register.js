import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(user);
      alert("Registered Successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" className="form-control my-2" placeholder="First Name" onChange={(e) => setUser({ ...user, first_name: e.target.value })} required />
        <input type="text" className="form-control my-2" placeholder="Last Name" onChange={(e) => setUser({ ...user, last_name: e.target.value })} required />
        <input type="email" className="form-control my-2" placeholder="Email" onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        <input type="password" className="form-control my-2" placeholder="Password" onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      <p className="mt-2">Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Register;
