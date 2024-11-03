import React, { useState } from "react";
import './navbar.css';
import { Link } from "react-router-dom";
import Modal from "../Modal";
import Cart from "../screens/cart";
import { useCart } from "./ContextReducer";
import { FaSearch, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  const handlelogout = () => {
    localStorage.removeItem("authToken");
  };
  const loadCart = () => {
    setCartView(true);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const items = useCart();

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand fs-4" to="/" style={{ color: '#fff' }}>
            ChefCart
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item fs-5">
                <Link className="nav-link active" aria-current="page" to="/youtube" style={{ color: '#fff' }}>
                  Recipe
                </Link>
              </li>
            </ul>

            {/* Search Bar in the center of navbar */}
            <form className="d-flex mx-auto" style={{ width: "40%" }} onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search here...."
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              >
                <FaSearch />
              </button>
            </form>

            {/* View Cart button outside dropdown */}
            <div className="btn btn-light fs-5 me-3" onClick={loadCart}>
              <FaShoppingCart /> Cart{" "}
              <span className="badge text-bg-light">{items.length}</span>
            </div>

            {/* Dropdown for user options (Profile, Orders, Logout) */}
            {(!localStorage.getItem("authToken")) ? (
              <div className="nav-item d-flex me-3">
                <Link className="btn btn-light fs-5 me-3" to="/signup">Signup</Link>
                <Link className="btn btn-light fs-5" to="/login">Login</Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle fs-5"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={24} />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                  <li>
                    <Link className="dropdown-item" to="/myorders">My Orders</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/login" onClick={handlelogout}>Logout</Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Cart Modal */}
            {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : ""}
          </div>
        </div>
      </nav>
    </div>
  );
}
