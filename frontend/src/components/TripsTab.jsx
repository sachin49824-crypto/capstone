import React, { useState } from 'react';
import { 
  Navigation, 
  Plus, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  CheckCircle2, 
  PlayCircle 
} from 'lucide-react';

export default function TripsTab({ trips = [], openModal }) {
  const [filter, setFilter] = useState('ALL');

  const filteredTrips = trips.filter(t => {
    if (filter === 'ACTIVE') return !t.end_time;
    if (filter === 'COMPLETED') return !!t.end_time;
    return true;
  });

  const formatDate = (str) => {
    if (!str) return '—';
    try {
      return new Date(str).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return str;
    }
  };

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="metric-icon amber" style={{ width: 42, height: 42 }}>
            <Navigation size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Trip Lifecycle & Dispatch ({trips.length})</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle dispatch routes, active journeys, and history</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            style={{ width: '150px', padding: '8px 12px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Trips ({trips.length})</option>
            <option value="ACTIVE">Active Trips ({trips.filter(t => !t.end_time).length})</option>
            <option value="COMPLETED">Completed ({trips.filter(t => t.end_time).length})</option>
          </select>

          <button className="btn-primary" onClick={() => openModal('trip')}>
            <Plus size={16} /> Dispatch Trip
          </button>
        </div>
      </div>

      {/* Trips Table Panel */}
      <div className="card-panel">
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Vehicle & Driver</th>
                <th>Route (Origin → Destination)</th>
                <th>Dispatch Time</th>
                <th>Completion Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No trips recorded in this view.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const isActive = !trip.end_time;

                  return (
                    <tr key={trip.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Truck size={18} color="#818cf8" />
                          <div>
                            <strong style={{ fontSize: '0.9rem' }}>{trip.vehicle_number || `Vehicle #${trip.vehicle_id}`}</strong>
                            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <User size={12} /> {trip.driver_name || `Driver #${trip.driver_id}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                          <MapPin size={14} color="#34d399" />
                          <span>{trip.start_location || 'Origin'}</span>
                          <span style={{ color: 'var(--text-muted)' }}>→</span>
                          <MapPin size={14} color="#f87171" />
                          <span>{trip.end_location || (isActive ? 'In Transit...' : 'Finished')}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          <Clock size={14} />
                          {formatDate(trip.start_time)}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {formatDate(trip.end_time)}
                        </span>
                      </td>

                      <td>
                        {isActive ? (
                          <span className="badge badge-in_use" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <PlayCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} /> Completed
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {isActive ? (
                          <button
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => openModal({ type: 'finishTrip', trip })}
                          >
                            End Trip
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
