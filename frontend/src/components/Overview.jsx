import React from 'react';
import { 
  Truck, 
  Users, 
  Navigation, 
  Wrench, 
  Plus, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Fuel
} from 'lucide-react';

export default function Overview({ data, setActiveTab, openModal }) {
  const summary = data.summary || {};
  const vehicles = data.vehicles || [];
  const trips = data.trips || [];
  const activeTrips = trips.filter(t => !t.end_time);

  const alerts = data.alerts || [];
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  const kpis = [
    { title: 'Total Vehicles', value: summary.totalVehicles || vehicles.length || 0, icon: Truck, color: 'indigo' },
    { title: 'Available Drivers', value: summary.totalDrivers || data.drivers?.length || 0, icon: Users, color: 'emerald' },
    { title: 'Active Trips', value: summary.activeTrips || activeTrips.length || 0, icon: Navigation, color: 'amber' },
    { title: 'Active Alerts', value: summary.activeAlerts ?? activeAlerts.length ?? 0, icon: ShieldAlert, color: 'rose' },
  ];

  const formatDate = (str) => {
    if (!str) return 'N/A';
    try {
      return new Date(str).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return str;
    }
  };

  return (
    <div className="page-container">
      {/* Top Banner Action Section */}
      <div className="card-panel" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%)',
        borderColor: 'rgba(99,102,241,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Fleet Operational Command Center</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor real-time vehicle positions, assign drivers to active trips, and dispatch maintenance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => openModal('trip')}>
            <Plus size={16} /> Dispatch Trip
          </button>
          <button className="btn-secondary" onClick={() => openModal('vehicle')}>
            <Plus size={16} /> Add Vehicle
          </button>
          <button className="btn-secondary" onClick={() => openModal('fuel')}>
            <Fuel size={16} /> Log Fuel
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="metrics-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div className="metric-card" key={kpi.title}>
              <div className={`metric-icon ${kpi.color}`}>
                <Icon size={26} />
              </div>
              <div className="metric-info">
                <p>{kpi.title}</p>
                <h3>{kpi.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Trips & Vehicle Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Active Trips Card */}
        <div className="card-panel">
          <div className="card-header">
            <div>
              <h2>Active Journeys ({activeTrips.length})</h2>
              <p>Vehicles currently on route</p>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('trips')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          {activeTrips.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Navigation size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
              <p>No active trips in progress.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeTrips.slice(0, 4).map((trip) => (
                <div 
                  key={trip.id}
                  style={{
                    padding: '14px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={16} color="#818cf8" />
                      {trip.vehicle_number || `Vehicle #${trip.vehicle_id}`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} /> {trip.start_location || 'Depot'}
                      <Clock size={12} style={{ marginLeft: 6 }} /> {formatDate(trip.start_time)}
                    </div>
                  </div>
                  <button 
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.775rem' }}
                    onClick={() => openModal({ type: 'finishTrip', trip })}
                  >
                    End Trip
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Status Directory Preview */}
        <div className="card-panel">
          <div className="card-header">
            <div>
              <h2>Fleet Status Breakdown</h2>
              <p>Current operational availability</p>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setActiveTab('vehicles')}>
              Directory <ArrowRight size={14} />
            </button>
          </div>

          {vehicles.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Truck size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
              <p>No vehicles registered in fleet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vehicles.slice(0, 5).map((vehicle) => (
                <div
                  key={vehicle.id}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{vehicle.vehicle_number}</strong>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {vehicle.make} {vehicle.model} · {vehicle.current_location || 'Location unassigned'}
                    </p>
                  </div>
                  <span className={`badge badge-${vehicle.status || 'idle'}`}>
                    {vehicle.status?.replace('_', ' ') || 'idle'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
