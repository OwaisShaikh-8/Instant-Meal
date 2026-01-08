import React, { useState } from "react";
import navLogo from "../assets/images/logo.png";
import SignUpModal from "./SignUpModal.jsx";
import LoginModal from "./LoginModal.jsx"

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (







    <nav className="pt-[33px] fixed top-0 z-50 px-[20px] w-full flex justify-center bg-transparent">
      <div className="container w-full  bg-white px-[17px] py-[10px] rounded-full flex items-center justify-between relative">
        {/* Logo */}
        <a href="#">
          <img src={navLogo} alt="Logo" className="w-[130px] sm:w-[150px]" />
        </a>

        {/* Desktop Button */}
        {/* <!-- Nav Button --> */}
        <button  onClick={() => setIsLoginModalOpen(true) } className="bg-[#FFA31A] hidden md:block text-white px-4 py-2 rounded-full w-fit font-bold hover:bg-[#FFA31A]/80   transition">
            Login
          </button>

        {/* Hamburger */}
        <button
          className="sm:hidden flex flex-col gap-[4px]"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-[2px] bg-[#b48383]"></span>
          <span className="w-6 h-[2px] bg-[#3A3A3A]"></span>
          <span className="w-6 h-[2px] bg-[#3A3A3A]"></span>
        </button>

        {/* Mobile Menu */}

        <div
          className={`
    absolute top-[60px] left-0 w-full bg-white rounded-full px-[20px] py-4
    flex justify-center sm:hidden
    transition-all duration-300 ease-out
    ${
      open
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }
  `}
        >
          <button onClick={() => document.getElementById("my_modal_1")?.showModal() } className="bg-[#FFA31A] text-white px-6 py-2 rounded-full w-full font-bold hover:bg-[#FFA31A]/80   transition">
            Login
          </button>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} openRegisterModal={() => {setIsSignUpModalOpen(true)}}/>
      <SignUpModal isOpen={isSignUpModalOpen} setIsOpen={ setIsSignUpModalOpen} openLoginModal={() => {setIsLoginModalOpen(true)} } />
    </nav>
  );
};

export default Navbar;
