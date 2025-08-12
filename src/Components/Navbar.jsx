import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title"> Tic Tac Toe</div>
      <div className="navbar-links">
        <a href="/">Home</a>
      </div>
    </nav>
  );
};

export default Navbar;