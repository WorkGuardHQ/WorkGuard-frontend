// import React from 'react';

// const BranchFormModal = ({ show, title, onClose, children }) => {
//   if (!show) return null;

//   return (
//     <div className="modal-backdrop-modern">
//       <div className="modal-container-modern">
//         <div className="modal-content-modern" style={{ maxWidth: 900 }}>
          
//           {/* Header */}
//           <div className="modal-header-modern">
//             <h4 className="modal-title-modern">
//               <i className="fas fa-building"></i>
//               {title}
//             </h4>
//             <button className="modal-close-btn" onClick={onClose}>
//               ×
//             </button>
//           </div>

//           {/* Body */}
//           <div className="modal-body-modern">
//             {children}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default BranchFormModal;

import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';

const branchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const MapAutoCenter = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
};


const MapFitBounds = ({ lat, lng, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng || !radius) return;

    const offset = radius / 111000;

    const bounds = [
      [lat - offset, lng - offset],
      [lat + offset, lng + offset],
    ];

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [lat, lng, radius, map]);

  return null;
};



const BranchFormModal = ({ show, formData, setFormData, editingId, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchSuccess, setSearchSuccess] = React.useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onCancel]);




  
  // Prevent body scroll when modal is open
  // Prevent body scroll when modal is open
useEffect(() => {
  if (show) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.removeProperty('overflow');   // ← بدل 'unset'
  }
  return () => {
    document.body.style.removeProperty('overflow');   // ← بدل 'unset'
  };
}, [show]);

const fetchTimezone = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`
    );

    const data = await res.json();
    
// console.log('Timezone result:', data);


    return data.timeZone || '';
  } catch (err) {
    console.error('Timezone fetch error:', err);
    return '';
  }
};

  // const handleMapClick = (latlng) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     lat: latlng.lat.toFixed(6),
  //     lng: latlng.lng.toFixed(6),
  //   }));
  // };

  const handleMapClick = async (latlng) => {
  const lat = latlng.lat.toFixed(6);
  const lng = latlng.lng.toFixed(6);

  // const timezone = await fetchTimezone(lat, lng);
let timezone = '';

try {
  timezone = await fetchTimezone(lat, lng);
} catch {
  timezone = '';
}

  setFormData((prev) => ({
    ...prev,
    lat,
    lng,
    timezone: timezone || '',
  }));



};
  const handleUseMyLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setFormData((prev) => ({
        ...prev,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),

        // لو لسه مختارش timezone
       timezone: timezone || '',
      }));

    },
    (error) => {
      console.error(error);
      alert('Unable to get your location');
    }
  );
};

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      setSearchSuccess('');

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&accept-language=en&q=${encodeURIComponent(searchQuery)}`
      );
  
      const data = await res.json();

      if (!data || data.length === 0) {
        return;
      }

      const first = data[0];

      // console.log(first);

      
      const lat = parseFloat(first.lat);
      const lng = parseFloat(first.lon);
      // const timezone = await fetchTimezone(lat, lng);

      let timezone = '';

try {
  timezone = await fetchTimezone(lat, lng);
} catch {
  timezone = '';
}
      setFormData((prev) => ({
        ...prev,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
       timezone: timezone || '',

      }));


  


      setSearchSuccess(`${t('Found')}: ${first.display_name}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!show) return null;

  const TIMEZONES = [
  { value: '',                    label: '🌍 Use Company Default' },
  { value: 'Africa/Cairo',        label: 'Cairo (UTC+2/+3)' },
  { value: 'Asia/Riyadh',         label: 'Riyadh (UTC+3)' },
  { value: 'Asia/Dubai',          label: 'Dubai (UTC+4)' },
  { value: 'Asia/Kuwait',         label: 'Kuwait (UTC+3)' },
  { value: 'Asia/Beirut',         label: 'Beirut (UTC+2/+3)' },
  { value: 'Asia/Amman',          label: 'Amman (UTC+2/+3)' },
  { value: 'Asia/Baghdad',        label: 'Baghdad (UTC+3)' },
  { value: 'Europe/London',       label: 'London (UTC+0/+1)' },
  { value: 'Europe/Paris',        label: 'Paris (UTC+1/+2)' },
  { value: 'America/New_York',    label: 'New York (UTC-5/-4)' },
  { value: 'Asia/Karachi',        label: 'Karachi (UTC+5)' },
  { value: 'Asia/Kolkata',        label: 'India (UTC+5:30)' },
  { value: 'Asia/Singapore',      label: 'Singapore (UTC+8)' },
  { value: 'UTC',                 label: 'UTC (Universal)' },
];


  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop-modern" onClick={onCancel}></div>

      {/* Modal Container */}
      <div className="modal-container-form">
        <div className="modal-content-form">
          {/* Modal Header */}
          <div className="modal-header-form">
            <h5 className="modal-title-form">
              <i className={editingId ? "fas fa-edit" : "fas fa-plus-circle"}></i>
              {editingId ? t('adminBranches.editBranch') : t('adminBranches.addBranch')}
            </h5>
            <button className="modal-close-btn" onClick={onCancel} type="button">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body-form">
            <form onSubmit={onSubmit} id="branch-form">
              {/* Branch Name */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-tag"></i>
                  {t('adminBranches.branchName')}
                </label>
                <input
                  type="text"
                  className="form-control-modern"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={t('Enter branch name')}
                  autoFocus
                />
              </div>

              {/* Coordinates Row */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <i className="fas fa-map-marker-alt"></i>
                      {t('adminBranches.latitude')}
                    </label>
                    <input
                      type="number"
                      className="form-control-modern"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      required
                      step="any"
                      placeholder="24.7136"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group-modern">
                    <label className="form-label-modern">
                      <i className="fas fa-map-marker-alt"></i>
                      {t('adminBranches.longitude')}
                    </label>
                    <input
                      type="number"
                      className="form-control-modern"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      required
                      step="any"
                      placeholder="46.6753"
                    />
                  </div>
                </div>
              </div>

              {/* Radius */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-ruler-combined"></i>
                  {t('adminBranches.radius')} ({t('meters')})
                </label>
                <input
                  type="number"
                  className="form-control-modern"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                  required
                  placeholder="500"
                />
     <small className="form-text-modern">
  {t('adminBranches.radiusHelp') || 
    'Defines the allowed check-in area around the branch location. GPS accuracy may slightly extend the effective range.'
  }

  <br />
  <br />

  <strong>{t('adminBranches.recommended')}</strong>

  <br />

  • {t('adminBranches.smallOffices')}: 15–30m + WiFi

  <br />

  • {t('adminBranches.mediumOffices')}: 40–80m

  <br />

  • {t('adminBranches.largeBuildings')}: 100m+
</small>

              </div>

              {/* Transit Threshold */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-route"></i>
                  {t('adminBranches.transitThresholdMinutes') || 'وقت المواصلات المسموح (دقائق)'}
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control-modern"
                  value={formData.transitThresholdMinutes}
                  onChange={(e) => setFormData({ ...formData, transitThresholdMinutes: e.target.value })}
                  placeholder="30"
                />
                <small className="form-text-modern">
                  {t('Enter the allowed travel time between branches.If no value is entered, it will be taken from the employee settings or the system s default value of 60 minutes.') || 'إذا لم تدخل قيمة، سيتم أخذها من إعدادات الموظف أو القيمة العامة (60 دقيقة)'}
                </small>
              </div>

              {/* Allowed IPs */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-network-wired"></i>
                  {t('adminBranches.allowedIPs')}
                </label>
                <input
                  type="text"
                  className="form-control-modern"
                  value={formData.allowedIPs}
                  onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
                  placeholder="192.168.1.1, 192.168.1.2"
                />
                <small className="form-text-modern">
                  {t('Separate IPs with commas') || 'افصل عناوين IP بفواصل'}
                </small>
              </div>

              {/* Location Search */}
              <div className="search-wrapper">
                <label className="form-label-modern">
                  <i className="fas fa-search-location"></i>
                  {t('Search for location')}
                </label>
                <div className="search-input-group">
                  <input
                    type="text"
                    className="search-input"
                    placeholder={t('Example: Nasr City Cairo')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation(e)}
                  />
                  <button
                    className="btn-primary-modern btn-modern"
                    type="button"
                    onClick={handleSearchLocation}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <>
                        <div className="spinner-border spinner-border-sm" />
                        {t('Searching')}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search" />
                        {t('Search')}
                      </>
                    )}
                  </button>
                </div><div style={{ marginTop: '10px' }}>
  <button
    type="button"
    className="btn-primary-modern btn-modern"
    onClick={handleUseMyLocation}
  >
    <i className="fas fa-location-crosshairs"></i>
    Use My Location
  </button>
</div>
                {searchSuccess && (
                  <small className="text-success-modern mt-2 d-block">
                    <i className="fas fa-check-circle me-1"></i>
                    {searchSuccess}
                  </small>
                )}
                <small className="form-text-modern">
                  {t('Locate the site in detail on the map. Click on the map to select the location.') || 'انقر على الخريطة لاختيار الموقع'}
                </small>
              </div>

              {/* Map */}
              <div className="form-group-modern">
                <label className="form-label-modern">
                  <i className="fas fa-map"></i>
                  {t('adminBranches.selectLocationOnMap')}
                </label>
                <div className="map-container-modern">
                  <MapContainer
                    center={
                      formData.lat && formData.lng
                        ? [parseFloat(formData.lat), parseFloat(formData.lng)]
                        : [30.0444, 31.2357]
                    }
                    zoom={10}
                    style={{ height: '300px', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker onLocationSelect={handleMapClick} />
                    <MapAutoCenter
                      lat={formData.lat ? parseFloat(formData.lat) : null}
                      lng={formData.lng ? parseFloat(formData.lng) : null}
                    />

                    <MapFitBounds
  lat={formData.lat ? parseFloat(formData.lat) : null}
  lng={formData.lng ? parseFloat(formData.lng) : null}
  radius={formData.radius ? Number(formData.radius) : null}
/>
                    {formData.lat && formData.lng && (
                      <Marker
                        position={[parseFloat(formData.lat), parseFloat(formData.lng)]}
                        icon={branchIcon}
                      >
                        <Popup>{t('adminBranches.selectedLocation')}</Popup>
                      </Marker>
                    )}
                    {formData.lat && formData.lng && formData.radius && (
  <Circle
    center={[parseFloat(formData.lat), parseFloat(formData.lng)]}
    radius={Number(formData.radius)}
   pathOptions={{
  color: '#2563eb',
  fillColor: '#3b82f6',
  fillOpacity: 0.15,
  weight: 2,
  dashArray: '6, 6'
}}
  />
)}
                  </MapContainer>
                </div>
              </div><div className="form-group-modern">
  <label className="form-label-modern">
    <i className="fas fa-globe"></i>
    {t('Timezone')} 
  </label>
  <select
    className="form-control-modern"
    value={formData.timezone || ''}
    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
  >
    {TIMEZONES.map(tz => (
      <option key={tz.value} value={tz.value}>
        {tz.label}
      </option>
    ))}
  </select>
  <small className="form-text-modern">
    🌍 Leave as "Company Default" unless this branch is in a different country
  </small>
</div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer-form">
            <button type="button" className="btn-secondary-modern btn-modern" onClick={onCancel}>
              <i className="fas fa-times"></i>
              {t('adminBranches.cancel')}
            </button>
            <button type="submit" form="branch-form" className="btn-primary-modern btn-modern">
              <i className="fas fa-save"></i>
              {editingId ? t('adminBranches.update') : t('adminBranches.addBranch')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchFormModal;
