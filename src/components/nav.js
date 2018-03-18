import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => (
  <nav>
    <ul>
      <li>
        <NavLink exact to='/'>Home</NavLink>
      </li>
      <li>
        <NavLink exact to='/About'>Contact</NavLink>
      </li>
    </ul>
  </nav>
)







export default Nav;