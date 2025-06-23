import React from 'react';

const PatientsList = ({ patients = [], loading = false, onDelete = () => {} }) => {
  if (loading) return <div className="loading">Cargando pacientes...</div>;
  
  return (
    <div className="card">
      <h2>Lista de Pacientes</h2>
      {patients.length === 0 ? (
        <p>No hay pacientes registrados</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Tipo de Sangre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.bloodType || 'N/A'}</td>
                <td>
                  <button 
                    onClick={() => onDelete(patient._id, 'patient')}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientsList;