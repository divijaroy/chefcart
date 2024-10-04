import React from 'react';
import './Signupform.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
</style>

export default function Signupform() {
  const navigate = useNavigate();

  // Credentials will now have a single 'address' field instead of separate apartment details
  const [Credentials, setCredentials] = useState({ name: "", email: "", address: "", contactNumber: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/CreateUser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: Credentials.name,
          email: Credentials.email,
          address: Credentials.address,  // Submit the entire address as a single field
          contactNumber: Credentials.contactNumber,
          password: Credentials.password
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      console.log(json);
      if (!json.success) {
        alert("Something went wrong");
      }
      if (json.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...Credentials, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className='container' style={{ height: '650px', width: '1000px', alignItems: "center", justifyContent: "center", marginTop: '70px' }}>
        <div>
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '35px', textAlign: 'center', marginBottom: '10px', fontFamily: "Caveat,cursive" }}>Signup Form</h2>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control requi" name="name" value={Credentials.name} onChange={onChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control requi" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={Credentials.email} onChange={onChange} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea className="form-control requi" name="address" value={Credentials.address} onChange={onChange} placeholder="Enter full address (e.g., Apartment XYZ, Block A, Floor 5, Room 501)"></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">Contact Number</label>
              <input type="tel" className="form-control requi" name="contactNumber" value={Credentials.contactNumber} onChange={onChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control requi" id="exampleInputPassword1" name="password" value={Credentials.password} onChange={onChange} />
            </div>

            <div className="button-container">
              <button type="submit" className="btn btn-shadow">Submit</button>
              <Link className="btn btn-shadow align-right" to="/login" role="button">Already a user?</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
