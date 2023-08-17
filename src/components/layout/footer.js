import React from "react";
import './layout.css'

function Footer() {
  return (
    <footer>
      <small>&copy; My Tennis Space {new Date().getFullYear()}</small>
    </footer>
  );
}

export default Footer;