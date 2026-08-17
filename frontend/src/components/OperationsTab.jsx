import React, { useEffect, useState } from 'react';
import { 
  Wrench, 
  Fuel, 
  Plus, 
  Calendar, 
  DollarSign, 
  Truck, 
  Gauge, 
  FileText 
} from 'lucide-react';
import { api } from '../services/api';

export default function OperationsTab({ openModal, vehicles = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [maintLogs, setMaintLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      const [fData, mData] = await Promise.all([
        api.getFuel(),
        api.getMaintenance()
      ]);
      setFuelLogs(fData || []);
      setMaintLogs(mData || []);
    } catch (e) {
      console.warn('Error fetching operations logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const getVehicleNumber = (vId) => {
    const found = vehicles.find(v => v.id === vId);
    return found ? found.vehicle_number : `Vehicle #${vId}`;
  };

  return (
    <div className="page-container">
      {/* Header Bar */}
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="metric-icon rose" style={{ width: 42, height: 42 }}>
            <Wrench size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Operations & Servicing Center</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fuel refill tracking, maintenance logs, and vehicle expenditure</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={() => openModal('fuel')}>
            <Fuel size={16} /> Record Fuel
          </button>
          <button className="btn-primary" onClick={() => openModal('maintenance')}>
            <Wrench size={16} /> Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className={`btn-secondary ${activeSubTab === 'fuel' ? 'btn-primary' : ''}`}
          onClick={() => setActiveSubTab('fuel')}
        >
          <Fuel size={16} /> Fuel Refill Logs ({fuelLogs.length})
        </button>
        <button
          className={`btn-secondary ${activeSubTab === 'maintenance' ? 'btn-primary' : ''}`}
          onClick={() => setActiveSubTab('maintenance')}
        >
          <Wrench size={16} /> Maintenance Schedules ({maintLogs.length})
        </button>
      </div>

      {/* Sub Tab 1: Fuel Refill Logs Table */}
      {activeSubTab === 'fuel' && (
        <div className="card-panel">
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Fuel Quantity (L)</th>
                  <th>Total Cost ($/₹)</th>
                  <th>Odometer Reading</th>
                  <th>Fuel Station Location</th>
                </tr>
              </thead>
              <tbody>
                {fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No fuel refill logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  fuelLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Truck size={16} color="#818cf8" />
                          {log.vehicle_number || getVehicleNumber(log.vehicle_id)}
                        </strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#34d399' }}>{log.quantity} L</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{log.cost ? `$${log.cost}` : '—'}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {log.odometer_reading ? `${log.odometer_reading} km` : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {log.location || 'Station location unassigned'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 2: Maintenance Schedules Table */}
      {activeSubTab === 'maintenance' && (
        <div className="card-panel">
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service Type</th>
                  <th>Scheduled Date</th>
                  <th>Estimated Cost</th>
                  <th>Service Status</th>
                  <th>Notes / Description</th>
                </tr>
              </thead>
              <tbody>
                {maintLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                      No maintenance tasks scheduled.
                    </td>
                  </tr>
                ) : (
                  maintLogs.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Truck size={16} color="#818cf8" />
                          {m.vehicle_number || getVehicleNumber(m.vehicle_id)}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{m.maintenance_type}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {m.service_date || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{m.cost ? `$${m.cost}` : '—'}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${m.status || 'planned'}`}>
                          {m.status || 'planned'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {m.description || 'No additional notes'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
