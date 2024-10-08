import React from "react";
import Navbar from "../components/navbar";
import Caroussel from "../components/Caroussel";
import Categories from "../components/Categories"

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="mt-5">
        <Caroussel/>
      </div>

      <div className="mt-5">
        <Categories /> {/* This will render your categories below the carousel */}
      </div>
    </>
  );
}
