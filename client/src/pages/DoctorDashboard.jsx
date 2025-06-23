import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DoctorSidebar from '../components/Doctor/DoctorSidebar';
import DoctorHeader from '../components/Doctor/DoctorHeader';
import ScheduleForm from '../components/Doctor/ScheduleForm';
import AppointmentsList from '../components/Doctor/AppointmentsList';

const DoctorDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (activeTab === 'appointments') {
          const res = await axios.get('/doctors/appointments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAppointments(res.data.data);
        } else if (activeTab === 'schedule') {
          const res = await axios.get('/doctors/schedule', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSchedule(res.data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleUpdateSchedule = async (scheduleData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/doctors/schedule', scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSchedule(res.data.data);
      toast.success('Schedule updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      return false;
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/doctors/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment
        )
      );
      toast.success('Appointment status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddNotes = async (id, notes) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/doctors/appointments/${id}/notes`,
        { notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, notes } : appointment
        )
      );
      toast.success('Notes added to appointment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="doctor-dashboard">
      <DoctorSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="doctor-content">
        <DoctorHeader />
        <div className="doctor-main">
          {activeTab === 'appointments' && (
            <AppointmentsList
              appointments={appointments}
              loading={loading}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onAddNotes={handleAddNotes}
            />
          )}
          {activeTab === 'schedule' && (
            <ScheduleForm
              schedule={schedule}
              loading={loading}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;