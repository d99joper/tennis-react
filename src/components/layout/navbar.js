import React from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = ({useMenu: MyMenu, isLoggedIn, testing}) => {
  return (
        // <div>hello</div>
    <nav className="nav-container">
        <MyMenu isLoggedIn={isLoggedIn} testing={testing} key="mmmenu" />
      <ul className="nav-unordered-list">
        <li className="nav-list-item">
          <NavLink to="/" style={({isActive}) => ({
            color: isActive ? 'greenyellow' : 'white'})}>
            Home
          </NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/about" style={({isActive}) => ({
            color: isActive ? 'greenyellow' : 'white'})}>
            About
          </NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/profile" style={({isActive}) => ({
            color: isActive ? 'greenyellow' : 'white'})}>
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;