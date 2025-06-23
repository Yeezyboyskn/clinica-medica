import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import DoctorsList from '../components/Admin/DoctorsList';
import PatientsList from '../components/Admin/PatientsList';
import AppointmentsList from '../components/Admin/AppointmentsList';
import AddDoctorForm from '../components/Admin/AddDoctorForm';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (activeTab === 'doctors') {
          const res = await axios.get('/admin/doctors', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDoctors(res.data.data);
        } else if (activeTab === 'patients') {
          const res = await axios.get('/admin/patients', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPatients(res.data.data);
        } else if (activeTab === 'appointments') {
          const res = await axios.get('/admin/appointments', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAppointments(res.data.data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDeleteUser = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/admin/users/${id}?role=${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('User deleted successfully');
      if (role === 'doctor') {
        setDoctors(doctors.filter((doctor) => doctor._id !== id));
      } else if (role === 'patient') {
        setPatients(patients.filter((patient) => patient._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAddDoctor = async (doctorData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/admin/doctors', doctorData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors([...doctors, res.data.data]);
      toast.success('Doctor added successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      return false;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />
      <div className="admin-content">
        <AdminHeader />
        <div className="admin-main">
          {activeTab === 'doctors' && (
            <>
              <AddDoctorForm onAddDoctor={handleAddDoctor} />
              <DoctorsList
                doctors={doctors}
                loading={loading}
                onDelete={handleDeleteUser}
              />
            </>
          )}
          {activeTab === 'patients' && (
            <PatientsList
              patients={patients}
              loading={loading}
              onDelete={handleDeleteUser}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsList appointments={appointments} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;