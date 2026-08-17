import React, { useState } from 'react';
import { X } from 'lucide-react';

function ModalOverlay({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// Vehicle Modal Form (Supports Create and Update)
export function VehicleModal({ vehicle, drivers = [], onClose, onSave }) {
  const [form, setForm] = useState({
    vehicle_number: vehicle?.vehicle_number || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    fuel_type: vehicle?.fuel_type || 'diesel',
    status: vehicle?.status || 'idle',
    current_location: vehicle?.current_location || '',
    driver_id: vehicle?.driver_id || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      year: Number(form.year),
      driver_id: form.driver_id ? Number(form.driver_id) : null
    });
  };

  return (
    <ModalOverlay title={vehicle ? 'Edit Vehicle' : 'Add New Vehicle'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Vehicle Plate / Registration Number *</label>
          <input
            required
            className="form-control"
            placeholder="e.g. KA-01-AB-1234"
            value={form.vehicle_number}
            onChange={(e) => setForm({ ...form, vehicle_number: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Make</label>
            <input
              className="form-control"
              placeholder="Tata / Volvo / Ashok"
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Model</label>
            <input
              className="form-control"
              placeholder="Ace Gold / FH16"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Manufacturing Year</label>
            <input
              type="number"
              className="form-control"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Fuel Type</label>
            <select
              className="form-control"
              value={form.fuel_type}
              onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric</option>
              <option value="cng">CNG</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Operational Status</label>
            <select
              className="form-control"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="idle">Idle</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assigned Operator</label>
            <select
              className="form-control"
              value={form.driver_id}
              onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
            >
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Current Location / Station</label>
          <input
            className="form-control"
            placeholder="Depot / Bangalore Central Warehouse"
            value={form.current_location}
            onChange={(e) => setForm({ ...form, current_location: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Vehicle</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Driver Modal Form
export function DriverModal({ driver, onClose, onSave }) {
  const [form, setForm] = useState({
    name: driver?.name || '',
    phone: driver?.phone || '',
    license_number: driver?.license_number || '',
    status: driver?.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <ModalOverlay title={driver ? 'Edit Driver' : 'Add New Driver'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Full Operator Name *</label>
          <input
            required
            className="form-control"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            className="form-control"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Driver License Number</label>
          <input
            className="form-control"
            placeholder="DL-1420110012345"
            value={form.license_number}
            onChange={(e) => setForm({ ...form, license_number: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Duty Status</label>
          <select
            className="form-control"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active Duty</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Driver</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Start Trip Modal Form
export function TripModal({ vehicles = [], drivers = [], onClose, onSave }) {
  const [form, setForm] = useState({
    vehicle_id: '',
    driver_id: '',
    start_location: ''
  });

  const availableVehicles = vehicles.filter(v => v.status !== 'maintenance');
  const activeDrivers = drivers.filter(d => d.status === 'active');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      vehicle_id: Number(form.vehicle_id),
      driver_id: Number(form.driver_id),
      start_location: form.start_location
    });
  };

  return (
    <ModalOverlay title="Dispatch New Trip" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Select Fleet Vehicle *</label>
          <select
            required
            className="form-control"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          >
            <option value="">-- Choose Vehicle --</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicle_number} · {v.make} {v.model} ({v.status})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Assign Driver *</label>
          <select
            required
            className="form-control"
            value={form.driver_id}
            onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
          >
            <option value="">-- Choose Driver --</option>
            {activeDrivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Dispatch / Origin Location</label>
          <input
            className="form-control"
            placeholder="Central Depot / Warehousing Bay 4"
            value={form.start_location}
            onChange={(e) => setForm({ ...form, start_location: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Dispatch Trip</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Complete Trip Modal Form
export function FinishTripModal({ trip, onClose, onSave }) {
  const [endLocation, setEndLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(endLocation);
  };

  return (
    <ModalOverlay title="Finalize Active Trip" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Completing active trip for <strong>{trip?.vehicle_number || `Vehicle #${trip?.vehicle_id}`}</strong>.
        </p>

        <div className="form-group">
          <label>Destination / Final Location</label>
          <input
            className="form-control"
            placeholder="Destination Terminal / Warehouse"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Complete Trip</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Log Fuel Modal
export function FuelModal({ vehicles = [], onClose, onSave }) {
  const [form, setForm] = useState({
    vehicle_id: '',
    quantity: '',
    cost: '',
    fuel_type: 'diesel',
    odometer_reading: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      vehicle_id: Number(form.vehicle_id),
      quantity: Number(form.quantity),
      cost: form.cost ? Number(form.cost) : null,
      fuel_type: form.fuel_type,
      odometer_reading: form.odometer_reading ? Number(form.odometer_reading) : null,
      location: form.location
    });
  };

  return (
    <ModalOverlay title="Log Fuel Refill" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Vehicle *</label>
          <select
            required
            className="form-control"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.vehicle_number} ({v.make})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Quantity (Litres) *</label>
            <input
              required
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 50.5"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Total Cost ($/₹)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 4500"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Odometer Reading (km)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 45200"
            value={form.odometer_reading}
            onChange={(e) => setForm({ ...form, odometer_reading: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Refill Station Location</label>
          <input
            className="form-control"
            placeholder="Shell Fuel Station, Highway 44"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save Fuel Log</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Schedule Maintenance Modal
export function MaintenanceModal({ vehicles = [], onClose, onSave }) {
  const [form, setForm] = useState({
    vehicle_id: '',
    maintenance_type: '',
    description: '',
    service_date: new Date().toISOString().slice(0, 10),
    cost: '',
    status: 'planned'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      vehicle_id: Number(form.vehicle_id),
      maintenance_type: form.maintenance_type,
      description: form.description,
      service_date: form.service_date,
      cost: form.cost ? Number(form.cost) : null,
      status: form.status
    });
  };

  return (
    <ModalOverlay title="Schedule Vehicle Maintenance" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Vehicle *</label>
          <select
            required
            className="form-control"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.vehicle_number} ({v.make})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Maintenance Service Type *</label>
          <input
            required
            className="form-control"
            placeholder="Oil Change / Brake Pad Replacement"
            value={form.maintenance_type}
            onChange={(e) => setForm({ ...form, maintenance_type: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Service Date</label>
            <input
              type="date"
              className="form-control"
              value={form.service_date}
              onChange={(e) => setForm({ ...form, service_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Service Status</label>
            <select
              className="form-control"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Estimated Cost ($/₹)</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 1200"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Description / Notes</label>
          <textarea
            rows="3"
            className="form-control"
            placeholder="Routine 10,000 km engine service and tire alignment..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Schedule Maintenance</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Log Location Telemetry Ping Modal
export function LocationModal({ vehicles = [], trips = [], onClose, onSave }) {
  const [form, setForm] = useState({
    vehicle_id: '',
    trip_id: '',
    latitude: '',
    longitude: '',
    speed: '',
    heading: ''
  });

  const activeTrips = trips.filter(t => !t.end_time);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      vehicle_id: Number(form.vehicle_id),
      trip_id: form.trip_id ? Number(form.trip_id) : null,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      speed: form.speed ? Number(form.speed) : null,
      heading: form.heading ? Number(form.heading) : null
    });
  };

  return (
    <ModalOverlay title="Log GPS Telemetry Ping" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group">
          <label>Vehicle *</label>
          <select
            required
            className="form-control"
            value={form.vehicle_id}
            onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.vehicle_number}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Active Trip (Optional)</label>
          <select
            className="form-control"
            value={form.trip_id}
            onChange={(e) => setForm({ ...form, trip_id: e.target.value })}
          >
            <option value="">None / Standalone Ping</option>
            {activeTrips.map((t) => (
              <option key={t.id} value={t.id}>{t.vehicle_number || `Trip #${t.id}`}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Latitude *</label>
            <input
              required
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 12.9716"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Longitude *</label>
            <input
              required
              type="number"
              step="any"
              className="form-control"
              placeholder="e.g. 77.5946"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Speed (km/h)</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 65"
              value={form.speed}
              onChange={(e) => setForm({ ...form, speed: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Heading (Degrees)</label>
            <input
              type="number"
              min="0"
              max="360"
              className="form-control"
              placeholder="e.g. 180"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '10px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">Save GPS Ping</button>
        </div>
      </form>
    </ModalOverlay>
  );
}
