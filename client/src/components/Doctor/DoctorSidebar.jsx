import React from 'react';
import { NavLink } from 'react-router-dom';

const DoctorSidebar = ({ onLogout }) => {
  return (
    <div className="doctor-sidebar">
      <div className="sidebar-header">
        <h3>Panel Médico</h3>
      </div>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/doctor/dashboard?tab=appointments" 
              activeClassName="active"
            >
              Mis Citas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/doctor/dashboard?tab=schedule" 
              activeClassName="active"
            >
              Mi Horario
            </NavLink>
          </li>
        </ul>
      </nav>
      <button onClick={onLogout} className="logout-btn">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default DoctorSidebar;