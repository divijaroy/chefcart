import React, { useState } from "react";
import './navbar.css';
import { Link } from "react-router-dom";
import Modal from "../Modal";
import Cart from "../screens/cart";
import { useCart } from "./ContextReducer";
import { FaSearch } from "react-icons/fa";
<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
</style>

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  const handlelogout = () => {
    localStorage.removeItem("authToken");
  };
  const loadCart = () => {
    setCartView(true);
  };
  const items = useCart();

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg" >
        <div className="container-fluid">
          <Link className="navbar-brand fs-4" to="/" style={{ color: '#fff' }}>
            ChefCart
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {(localStorage.getItem("authToken")) ? (
                <>
                  {/* <li className="nav-item fs-5">
                    <Link className="nav-link active" aria-current="page" to="/orders" style={{ color: '#fff' }}>
                      OrderNew
                    </Link>
                  </li> */}
                  <li className="nav-item fs-5">
                    <Link className="nav-link active" aria-current="page" to="/youtube" style={{ color: '#fff' }}>
                      Recipe
                    </Link>
                  </li>
                </>
              ) : (" ")}

            </ul>

            {/* Search Bar in the center of navbar */}
            <form className="d-flex mx-auto" style={{ width: "40%" }}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search here...."
                aria-label="Search"
                style={{
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  border: "1px solid #eaeaea",
                  outline: "none",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <button
                className="btn btn-outline-light"
                type="submit"
                style={{
                  borderRadius: "20px",
                  padding: "0.5rem 1rem",
                  marginLeft: "-45px",
                  zIndex: 1,
                  backgroundColor: "#fff", // Background color for the search button
                  color: "#000",
                }}
              >
                <FaSearch />
              </button>
            </form>

            {(!localStorage.getItem("authToken"))
              ? (
                <div>
                  <div className="nav-item d-flex me-3">
                    <Link className="btn btn-light fs-5 me-3" to="/signup">signup</Link>
                    <Link className="btn btn-light fs-5 " to="/login">Login</Link>
                  </div>
                </div>
              ) : (
                <div className="nav-item d-flex">
                  <div className="btn btn-light fs-5 me-3" onClick={loadCart} >
                    viewCart{" "}
                    <span className="badge text-bg-primary ">{items.length}</span>
                  </div>
                  {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}
                  <Link className="btn btn-light fs-5 me-3" to="/Profile">Profile</Link>
                  <Link className="btn btn-light fs-5 me-3" to="/login" onClick={handlelogout}>Logout</Link>
                </div>
              )}
          </div>
        </div>
      </nav>
    </div>
  );
}
