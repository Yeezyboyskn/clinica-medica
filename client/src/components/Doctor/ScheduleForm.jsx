import React, { useState, useEffect } from 'react';

const ScheduleForm = ({ schedule, onUpdateSchedule }) => {
  const [formData, setFormData] = useState({
    workingDays: [],
    startTime: '09:00',
    endTime: '17:00',
    appointmentDuration: 30,
    breaks: []
  });

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSchedule(formData);
  };

  return (
    <div className="schedule-form">
      <h2>Configurar Horario</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}
        <button type="submit" className="btn-primary">
          Guardar Horario
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;