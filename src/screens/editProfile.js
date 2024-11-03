import React, { useState } from 'react';

export default function EditUserProfile({ userData }) {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [Credentials, setCredentials] = useState({
    name: userData.name,
    address: userData.address,
    contactNumber: userData.contactNumber
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/updateUser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: Credentials.name,
          email: localStorage.getItem('userEmail'),
          address: Credentials.address,
          contactNumber: Credentials.contactNumber
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
        setUpdateSuccess(true);
      }

    } catch (error) {
      console.error('Error:', error);
      alert("An error occurred. Please try again.");
    }
  };

  const onChange = (event) => {
    setCredentials({ ...Credentials, [event.target.name]: event.target.value });
  };

  if (updateSuccess) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'white', fontSize: '35px', textAlign: 'center', marginBottom: '10px', fontFamily: 'Caveat,cursive' }}>Update Successful!</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div >
          <form onSubmit={handleSubmit} >
            <h2 style={{ color: 'white', fontSize: '35px', textAlign: 'center', marginBottom: '10px', fontFamily: "Caveat,cursive" }}>Update your info</h2>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-white">Name</label>
              <input type="text" style={{ fontWeight: '600' }} className="form-control requi" name="name" value={Credentials.name} onChange={onChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label text-white">Address</label>
              <input type="text" style={{ fontWeight: '600' }} className="form-control requi" name="address" value={Credentials.address} onChange={onChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label text-white">Contact Number</label>
              <input type="tel" style={{ fontWeight: '600' }} className="form-control requi" name="contactNumber" value={Credentials.contactNumber} onChange={onChange} />
            </div>

            <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
              <button type="submit" className="btn btn-primary btn-shadow">Update Info</button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
