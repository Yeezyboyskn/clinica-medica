import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PatientSidebar from '../components/Patient/PatientSidebar';
import PatientHeader from '../components/Patient/PatientHeader';
import AppointmentsList from '../components/Patient/AppointmentsList';
import BookAppointment from '../components/Patient/BookAppointment';
import DoctorsList from '../components/Patient/DoctorsList';

const PatientDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (activeTab === 'appointments') {
          const res = await axios.get('/patients/appointments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAppointments(res.data.data);
        } else if (activeTab === 'doctors') {
          const res = await axios.get('/patients/doctors', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDoctors(res.data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/patients/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments([...appointments, res.data.data]);
      toast.success('Appointment booked successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      return false;
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/patients/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: 'cancelled' }
            : appointment
        )
      );
      toast.success('Appointment cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDoctorSelect = async (doctorId) => {
    try {
      setLoading(true);
      setSelectedDoctor(doctorId);
      const token = localStorage.getItem('token');
      const res = await axios.get(`/patients/doctors/${doctorId}/availability`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableSlots(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-dashboard">
      <PatientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="patient-content">
        <PatientHeader />
        <div className="patient-main">
          {activeTab === 'appointments' && (
            <AppointmentsList
              appointments={appointments}
              loading={loading}
              onCancel={handleCancelAppointment}
            />
          )}
          {activeTab === 'book' && (
            <>
              <DoctorsList
                doctors={doctors}
                loading={loading}
                onSelect={handleDoctorSelect}
              />
              {selectedDoctor && (
                <BookAppointment
                  doctorId={selectedDoctor}
                  availableSlots={availableSlots}
                  loading={loading}
                  onBook={handleBookAppointment}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;