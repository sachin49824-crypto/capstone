import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Filter, 
  Fuel, 
  User, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export default function VehiclesTab({ vehicles = [], drivers = [], openModal, onDelete }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = vehicles.filter(v => {
    const matchesSearch = 
      (v.vehicle_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.make || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.model || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Directory Action Header */}
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="metric-icon indigo" style={{ width: 42, height: 42 }}>
            <Truck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Vehicle Directory ({vehicles.length})</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage fleet inventory, status, and driver assignments</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              className="search-input"
              placeholder="Search vehicle number or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: '130px', padding: '8px 12px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="idle">Idle</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <button className="btn-primary" onClick={() => openModal('vehicle')}>
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicles Table Card */}
      <div className="card-panel">
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Vehicle Details</th>
                <th>Assigned Driver</th>
                <th>Current Location</th>
                <th>Fuel Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#818cf8'
                        }}>
                          <Truck size={18} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{v.vehicle_number}</strong>
                          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                            {v.make} {v.model} {v.year ? `(${v.year})` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                        <User size={14} color="var(--text-muted)" />
                        {v.driver_name || 'Unassigned'}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        {v.current_location || 'Depot / Unassigned'}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <Fuel size={14} color="var(--text-muted)" />
                        <span style={{ textTransform: 'capitalize' }}>{v.fuel_type || 'Diesel'}</span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge badge-${v.status || 'idle'}`}>
                        {v.status?.replace('_', ' ') || 'idle'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="icon-btn"
                          title="Edit Vehicle"
                          onClick={() => openModal({ type: 'editVehicle', vehicle: v })}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn-danger"
                          title="Delete Vehicle"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove vehicle ${v.vehicle_number}?`)) {
                              onDelete(v.id);
                            }
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
