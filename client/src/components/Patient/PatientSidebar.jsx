import React from 'react';
import { NavLink } from 'react-router-dom';

const PatientSidebar = ({ onLogout }) => {
  return (
    <div className="patient-sidebar">
      <div className="sidebar-header">
        <h3>Panel de Paciente</h3>
      </div>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/patient/dashboard?tab=appointments" 
              activeClassName="active"
            >
              Mis Citas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/patient/dashboard?tab=book" 
              activeClassName="active"
            >
              Reservar Cita
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

export default PatientSidebar;