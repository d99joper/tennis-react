import React from "react";
import "./layout.css";
import { NavLink } from "react-router-dom";

const Navbar = ({useMenu: MyMenu, isLoggedIn, testing}) => {
  return (
        // <div>hello</div>
    <nav className="nav-container">
        <MyMenu isLoggedIn={isLoggedIn} testing={testing} key="mmmenu" />
      <ul className="nav-unordered-list">
        <li className="nav-list-item">
          <NavLink to="/" style={({isActive}) => ({
            color: isActive ? '#000000' : '#aaaaaa'})}>
            Home
          </NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/about" style={({isActive}) => ({
            color: isActive ? '#000000' : '#aaaaaa'})}>
            About
          </NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/ladders" style={({isActive}) => ({
            color: isActive ? '#000000' : '#aaaaaa'})}>
            Ladders
          </NavLink>
        </li>
        <li className="nav-list-item">
          <NavLink to="/players" style={({isActive}) => ({
            color: isActive ? '#000000' : '#aaaaaa'})}>
            Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;