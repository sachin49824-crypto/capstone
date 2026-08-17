import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Shield, 
  Truck, 
  Edit3, 
  Trash2 
} from 'lucide-react';

export default function DriversTab({ drivers = [], openModal, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = drivers.filter(d => {
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.license_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.phone || '').includes(search);
    
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="metric-icon emerald" style={{ width: 42, height: 42 }}>
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Fleet Operators ({drivers.length})</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered drivers, licenses, and duty status</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              className="search-input"
              placeholder="Search name or license..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-control"
            style={{ width: '130px', padding: '8px 12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn-primary" onClick={() => openModal('driver')}>
            <Plus size={16} /> Add Driver
          </button>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="cards-grid">
        {filtered.length === 0 ? (
          <div className="card-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No drivers found matching your search.
          </div>
        ) : (
          filtered.map((driver) => (
            <div key={driver.id} className="driver-card">
              <div className="card-title-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar-circle" style={{ width: 42, height: 42, fontSize: '1.1rem' }}>
                    {driver.name ? driver.name[0].toUpperCase() : 'D'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem' }}>{driver.name}</h3>
                    <span className={`badge badge-${driver.status || 'active'}`} style={{ marginTop: 2 }}>
                      {driver.status?.replace('_', ' ') || 'active'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="icon-btn"
                    title="Edit Driver"
                    onClick={() => openModal({ type: 'editDriver', driver })}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    className="btn-danger"
                    title="Delete Driver"
                    onClick={() => {
                      if (window.confirm(`Delete driver profile for ${driver.name}?`)) {
                        onDelete(driver.id);
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="var(--text-muted)" />
                  <span>{driver.phone || 'Phone not registered'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={14} color="var(--text-muted)" />
                  <span>License: {driver.license_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
