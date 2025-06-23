import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookAppointment = ({ doctorId, availableSlots, onBook }) => {
  const [formData, setFormData] = useState({
    doctor: doctorId,
    date: new Date(),
    time: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(formData);
  };

  return (
    <div className="book-appointment">
      <h2>Reservar Nueva Cita</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <button type="submit" className="btn-primary">
          Reservar Cita
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;