import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Truck, 
  Users, 
  Navigation, 
  Wrench, 
  LogOut, 
  Radio,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {}, onLogout, isOpen, onClose }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Tracking', icon: Map, count: counts.activeTrips },
    { id: 'vehicles', label: 'Vehicles', icon: Truck, count: counts.vehicles },
    { id: 'drivers', label: 'Drivers', icon: Users, count: counts.drivers },
    { id: 'trips', label: 'Trips & Dispatch', icon: Navigation, count: counts.trips },
    { id: 'operations', label: 'Maintenance & Fuel', icon: Wrench },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <Radio size={22} />
        </div>
        <span className="brand-title">FleetPulse</span>
        {onClose && (
          <button className="icon-btn mobile-only" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <p className="nav-section-title">Fleet Navigation</p>

      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="nav-count">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <span>System Online · Spring API</span>
        </div>

        <button className="nav-item" onClick={onLogout} style={{ color: '#f87171' }}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
