import React from 'react'
import {Link, NavLink} from 'react-router-dom';

function Menu() {

  const handleConnect = () => {
        console.log('connect')
  }
  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/voters">Voters</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/proposals">Proposals</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className="nav-link" to="/results">Results</NavLink>
            </li>
            <li className="navbar-right connect">
                <button className="btn btn-primary connect" onClick={handleConnect}>Connect</button>
            </li>
        </ul>
        </div>
    </div>
    </nav>
  )
}

export default Menu