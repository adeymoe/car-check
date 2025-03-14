import React from 'react';
import { Link } from 'react-scroll';
import { FaCopyright, FaArrowUp } from 'react-icons/fa';
import './carCheck.css'; // Import the CSS file

const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <FaCopyright className="copyright-icon" />
        <p className="footer-text">Copyright 2025, MyCodeStory, All Rights Reserved</p>
      </div>
    </>
  );
};

export default Footer;