import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Overview from './Overview';
import LiveMap from './LiveMap';
import VehiclesTab from './VehiclesTab';
import DriversTab from './DriversTab';
import TripsTab from './TripsTab';
import OperationsTab from './OperationsTab';
import { 
  VehicleModal, 
  DriverModal, 
  TripModal, 
  FinishTripModal, 
  FuelModal, 
  MaintenanceModal, 
  LocationModal 
} from './Modals';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [data, setData] = useState({
    summary: null,
    vehicles: [],
    drivers: [],
    trips: []
  });

  // Modal & Toast states
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch central backend data
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [summary, vehicles, drivers, trips] = await Promise.all([
        api.getSummary().catch(() => null),
        api.getVehicles().catch(() => []),
        api.getDrivers().catch(() => []),
        api.getTrips().catch(() => [])
      ]);

      setData({ summary, vehicles, drivers, trips });
    } catch (err) {
      addToast(err.message || 'Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply root element theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // General handler to execute API calls and manage state
  const handleSave = async (apiFn, successMessage) => {
    try {
      await apiFn();
      setModal(null);
      addToast(successMessage, 'success');
      fetchData();
    } catch (err) {
      addToast(err.message || 'Action failed', 'error');
    }
  };

  const activeTripsCount = (data.trips || []).filter(t => !t.end_time).length;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--bg-main)'
      }}>
        <div className="avatar-circle spin" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>
          F
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Loading Fleet Operational Workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          activeTrips: activeTripsCount,
          vehicles: data.vehicles.length,
          drivers: data.drivers.length,
          trips: data.trips.length
        }}
        onLogout={onLogout}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={fetchData}
          isRefreshing={isRefreshing}
          theme={theme}
          setTheme={setTheme}
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {activeTab === 'overview' && (
          <Overview
            data={data}
            setActiveTab={setActiveTab}
            openModal={setModal}
          />
        )}

        {activeTab === 'map' && (
          <LiveMap
            vehicles={data.vehicles}
            trips={data.trips}
            openModal={setModal}
            onRefresh={fetchData}
          />
        )}

        {activeTab === 'vehicles' && (
          <VehiclesTab
            vehicles={data.vehicles}
            drivers={data.drivers}
            openModal={setModal}
            onDelete={(id) => handleSave(() => api.deleteVehicle(id), 'Vehicle removed from fleet directory.')}
          />
        )}

        {activeTab === 'drivers' && (
          <DriversTab
            drivers={data.drivers}
            openModal={setModal}
            onDelete={(id) => handleSave(() => api.deleteDriver(id), 'Driver profile deleted.')}
          />
        )}

        {activeTab === 'trips' && (
          <TripsTab
            trips={data.trips}
            openModal={setModal}
          />
        )}

        {activeTab === 'operations' && (
          <OperationsTab
            vehicles={data.vehicles}
            openModal={setModal}
          />
        )}
      </div>

      {/* Modals Management */}
      {modal === 'vehicle' && (
        <VehicleModal
          drivers={data.drivers}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createVehicle(formData), 'New vehicle registered.')}
        />
      )}

      {modal?.type === 'editVehicle' && (
        <VehicleModal
          vehicle={modal.vehicle}
          drivers={data.drivers}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.updateVehicle(modal.vehicle.id, formData), 'Vehicle details updated.')}
        />
      )}

      {modal === 'driver' && (
        <DriverModal
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createDriver(formData), 'Driver profile added.')}
        />
      )}

      {modal?.type === 'editDriver' && (
        <DriverModal
          driver={modal.driver}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.updateDriver(modal.driver.id, formData), 'Driver details updated.')}
        />
      )}

      {modal === 'trip' && (
        <TripModal
          vehicles={data.vehicles}
          drivers={data.drivers}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createTrip(formData), 'Trip dispatched successfully.')}
        />
      )}

      {modal?.type === 'finishTrip' && (
        <FinishTripModal
          trip={modal.trip}
          onClose={() => setModal(null)}
          onSave={(endLocation) => handleSave(() => api.endTrip(modal.trip.id, endLocation), 'Trip completed.')}
        />
      )}

      {modal === 'fuel' && (
        <FuelModal
          vehicles={data.vehicles}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createFuel(formData), 'Fuel refill log recorded.')}
        />
      )}

      {modal === 'maintenance' && (
        <MaintenanceModal
          vehicles={data.vehicles}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createMaintenance(formData), 'Maintenance service scheduled.')}
        />
      )}

      {modal === 'location' && (
        <LocationModal
          vehicles={data.vehicles}
          trips={data.trips}
          onClose={() => setModal(null)}
          onSave={(formData) => handleSave(() => api.createLocation(formData), 'GPS telemetry ping saved.')}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast"
            style={{
              borderLeftColor: toast.type === 'error' ? '#ef4444' : '#6366f1'
            }}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={18} color="#ef4444" />
            ) : (
              <CheckCircle2 size={18} color="#6366f1" />
            )}
            <span>{toast.message}</span>
            <button
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 8 }}
              onClick={() => removeToast(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
