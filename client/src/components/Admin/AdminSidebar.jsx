import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Panel de Administración</h3>
      </div>
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/admin/dashboard?tab=doctors" 
              activeClassName="active"
            >
              Médicos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/dashboard?tab=patients" 
              activeClassName="active"
            >
              Pacientes
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/dashboard?tab=appointments" 
              activeClassName="active"
            >
              Citas
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

export default AdminSidebar;