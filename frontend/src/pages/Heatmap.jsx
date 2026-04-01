import { MapPinned, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import CropMap from '../components/CropMap';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

function Heatmap() {
  const { uploads, farms } = useAuth();
  const [selectedPoint, setSelectedPoint] = useState(null);

  const points = uploads.filter((upload) => Array.isArray(upload.coordinates) && upload.coordinates.every((value) => typeof value === 'number'));
  const highRisk = points.filter((upload) => String(upload.severity).toLowerCase() === 'high').length;

  const getMatchedFarm = (locationName) => {
    return farms.find((farm) =>
      String(farm.location ?? '').toLowerCase().includes(String(locationName ?? '').toLowerCase()) ||
      String(locationName ?? '').toLowerCase().includes(String(farm.location ?? '').toLowerCase()),
    );
  };

  const matchedFarm = selectedPoint ? getMatchedFarm(selectedPoint.locationName) : null;

  return (
    <AppFrame title="Field Heatmap" subtitle="See analyzed farms on a live map, grouped by severity and location.">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="panel-label">Analyzed locations</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">{points.length}</p>
            <p className="mt-2 text-sm text-text-mid">Uploads with resolved coordinates</p>
          </Card>
          <Card>
            <p className="panel-label">High-risk points</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">{highRisk}</p>
            <p className="mt-2 text-sm text-text-mid">Marked for follow-up</p>
          </Card>
          <Card>
            <p className="panel-label">Workflow</p>
            <p className="mt-3 text-base font-semibold tracking-[-0.02em] text-text-dark">Upload, analyze, review map</p>
            <p className="mt-2 text-sm text-text-mid">Click any point to view farm details.</p>
          </Card>
        </section>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="panel-label">Heatmap</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Severity map for monitored farms</h2>
            </div>
            <div className="rounded-2xl bg-moss-pale p-3 text-moss">
              <MapPinned className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            {points.length ? (
              <div onClick={(e) => {
                const point = e.target.closest('[data-point-id]');
                if (point) {
                  const pointId = point.getAttribute('data-point-id');
                  const clickedPoint = points.find((p) => p.id === pointId);
                  if (clickedPoint) setSelectedPoint(clickedPoint);
                }
              }}>
                <CropMap points={points} />
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-earth-200 bg-earth-50 px-6 text-center">
                <TriangleAlert className="h-8 w-8 text-amber-600" />
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-text-dark">No map data yet</h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-text-mid">
                  Analyze a crop image with a location first. Once the backend resolves coordinates, the farm will appear here.
                </p>
                <Link to="/upload" className="mt-5">
                  <Button>Upload analysis</Button>
                </Link>
              </div>
            )}
          </div>

          {!!points.length && (
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-text-mid">
              <span className="inline-flex items-center gap-2 rounded-full bg-moss-pale px-3 py-1.5">
                <span className="h-3 w-3 rounded-full bg-moss/70" /> Low severity
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" /> Moderate severity
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500" /> High severity
              </span>
            </div>
          )}
        </Card>

        {!!points.length && (
          <div className="grid gap-4 lg:grid-cols-3">
            {points.slice(0, 3).map((point) => (
              <Card key={point.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPoint(point)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="panel-label">{point.crop}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text-dark">{point.locationName}</h3>
                  </div>
                  <Badge variant={String(point.severity).toLowerCase() === 'high' ? 'danger' : String(point.severity).toLowerCase() === 'moderate' ? 'warning' : 'success'}>
                    {point.severity}
                  </Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-text-mid">{point.disease}</p>
                <p className="mt-4 text-sm text-text-muted">{point.confidence}% confidence</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={Boolean(selectedPoint)} onClose={() => setSelectedPoint(null)} title={selectedPoint ? 'Farm details' : 'Point details'}>
        {selectedPoint && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Location', selectedPoint.locationName],
                ['Crop', selectedPoint.crop],
                ['Disease', selectedPoint.disease],
                ['Confidence', `${selectedPoint.confidence}%`],
                ['Severity', selectedPoint.severity],
                ['Analysis date', selectedPoint.reportDate || 'Unknown'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-beige p-4">
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className="mt-2 text-base font-medium text-text-dark">{value}</p>
                </div>
              ))}
            </div>

            {selectedPoint.summary && (
              <div className="rounded-2xl bg-moss-pale p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">Summary</p>
                <p className="mt-3 text-sm leading-6 text-text-dark">{selectedPoint.summary}</p>
              </div>
            )}

            {matchedFarm && (
              <div className="rounded-2xl bg-earth-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">Farmer contact</p>
                <p className="mt-3 text-base font-medium text-text-dark">{matchedFarm.owner}</p>
                <p className="mt-1 text-sm text-text-mid">{matchedFarm.email}</p>
                <p className="text-sm text-text-mid">{matchedFarm.phone}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AppFrame>
  );
}

export default Heatmap;
