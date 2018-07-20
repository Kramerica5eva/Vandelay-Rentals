import React from "react";
import { Link } from 'react-router-dom';
import "./Footer.css"

const Footer = () => (
  <footer className='footer'>
    <a href="https://github.com/Kramerica5eva/Vandelay-Rentals" target="_blank" rel="noopener noreferrer">GitHub</a>
    <p>&#9400;2018 Kramerica Industries</p>
    <Link className="btn-link" to="/about" role="button">About</Link>
  </footer>
)

export default Footer;