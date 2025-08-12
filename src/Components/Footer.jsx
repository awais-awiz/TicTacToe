import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Tic Tac Toe Game </p>
      <p>
        Made with 💜 | <a href="https://github.com/awais-awiz">GitHub</a>
      </p>
    </footer>
  );
};

export default Footer;




