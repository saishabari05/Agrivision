import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { severityColor } from '../utils/formatters';

function colorForSeverity(severity) {
  if (severity === 'High') return '#be123c';
  if (severity === 'Moderate') return '#b45309';
  return '#15803d';
}

function iconForSeverity(severity) {
  return L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${colorForSeverity(
      severity,
    )};border:3px solid white;box-shadow:0 10px 24px rgba(15,23,42,.22)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function CropMap({ points }) {
  return (
    <div className="glass-panel h-[360px] overflow-hidden p-3">
      <MapContainer center={[20.5937, 78.9629]} zoom={4} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker key={point.id} position={point.coordinates} icon={iconForSeverity(point.severity)}>
            <Popup>
              <div className="space-y-2">
                <p className="font-semibold">{point.crop}</p>
                <p className="text-sm">{point.locationName}</p>
                <p className="text-sm">{point.disease}</p>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${severityColor(point.severity)}`}>
                  {point.severity}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CropMap;

