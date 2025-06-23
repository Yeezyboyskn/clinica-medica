import React from 'react';

const DoctorsList = ({ doctors, loading, onDelete }) => {
  if (loading) return <div className="loading">Cargando médicos...</div>;

  return (
    <div className="doctors-list">
      <h2>Lista de Médicos</h2>
      <table className="doctors-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor._id}>
              <td>{doctor.name}</td>
              <td>{doctor.specialty}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
              <td>
                <button 
                  onClick={() => onDelete(doctor._id, 'doctor')}
                  className="btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;