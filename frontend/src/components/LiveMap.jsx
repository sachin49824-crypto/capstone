import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Radio, RefreshCw, Send, Plus } from 'lucide-react';
import { api } from '../services/api';

// Create custom colored marker icons for Leaflet
const createMarkerIcon = (colorHex) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${colorHex};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 12px ${colorHex};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const iconInUse = createMarkerIcon('#6366f1'); // Indigo
const iconIdle = createMarkerIcon('#10b981');  // Emerald
const iconMaint = createMarkerIcon('#ef4444'); // Rose

export default function LiveMap({ vehicles = [], trips = [], openModal, onRefresh }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [telemetryList, setTelemetryList] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetch location history
  const loadLocations = async () => {
    setLoadingLocations(true);
    try {
      const locs = await api.getLocations();
      setTelemetryList(locs || []);
    } catch (e) {
      console.warn('Could not load telemetry locations', e);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: India (Bangalore / Mumbai area coordinates standard default for fleet)
      const map = L.map(mapRef.current, {
        center: [12.9716, 77.5946],
        zoom: 11,
        zoomControl: true
      });

      // Use OpenStreetMap standard tiles and apply CSS inversion for dark mode
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when vehicles or telemetry updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds = [];

    // Map each vehicle using its latest location telemetry or default mock offset
    vehicles.forEach((v, index) => {
      // Find latest telemetry for vehicle or generate reasonable coordinates
      const loc = telemetryList.find(l => l.vehicle_id === v.id) || {};
      const lat = loc.latitude || (12.9716 + (index * 0.03) - 0.02);
      const lng = loc.longitude || (77.5946 + (index * 0.04) - 0.02);

      let markerIcon = iconIdle;
      if (v.status === 'in_use') markerIcon = iconInUse;
      if (v.status === 'maintenance') markerIcon = iconMaint;

      const marker = L.marker([lat, lng], { icon: markerIcon });
      
      const popupContent = `
        <div style="padding: 4px; font-family: Inter, sans-serif;">
          <strong style="font-size: 1rem; color: #f9fafb;">${v.vehicle_number}</strong>
          <p style="font-size: 0.8rem; color: #9ca3af; margin: 4px 0;">${v.make} ${v.model} (${v.fuel_type || 'Diesel'})</p>
          <div style="font-size: 0.775rem; margin-top: 6px;">
            <span style="color: #818cf8; font-weight: 600;">Status:</span> ${v.status || 'idle'}<br/>
            <span style="color: #9ca3af;">Location:</span> ${v.current_location || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => setSelectedVehicle(v));
      markersGroup.addLayer(marker);

      bounds.push([lat, lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [vehicles, telemetryList]);

  return (
    <div className="page-container">
      <div className="card-panel" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={20} color="#818cf8" />
          <h2 style={{ fontSize: '1.1rem' }}>Live GPS Fleet Tracker</h2>
          <span className="badge badge-active" style={{ marginLeft: 8 }}>
            ● {vehicles.length} Vehicles Tracked
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-secondary" onClick={loadLocations} disabled={loadingLocations}>
            <RefreshCw size={14} className={loadingLocations ? 'spin' : ''} /> Sync GPS
          </button>
          <button className="btn-primary" onClick={() => openModal('location')}>
            <Plus size={14} /> Log GPS Ping
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>
        {/* Leaflet Map Box */}
        <div className="map-container-wrap">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Vehicle List Panel */}
        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '520px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Tracked Assets ({vehicles.length})
          </h3>

          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              style={{
                padding: '12px',
                background: selectedVehicle?.id === v.id ? 'var(--accent-primary-light)' : 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: selectedVehicle?.id === v.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.9rem' }}>{v.vehicle_number}</strong>
                <span className={`badge badge-${v.status || 'idle'}`}>{v.status}</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {v.make} {v.model}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {v.current_location || 'GPS Signal Active'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
