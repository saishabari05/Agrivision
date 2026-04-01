import { AlertTriangle, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { fetchDashboard } from '../services/api';

function Alerts() {
  const { farms } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard().then((response) => setDashboard(response)).catch(() => setDashboard(null));
  }, []);

  const highAlerts = (dashboard?.topDiseases ?? []).filter((item) => String(item.severity).toLowerCase() === 'high' || String(item.severity).toLowerCase() === 'severe');
  
  const getMatchedFarm = (locationName) => {
    return farms.find((farm) =>
      String(farm.location ?? '').toLowerCase().includes(String(locationName ?? '').toLowerCase()) ||
      String(locationName ?? '').toLowerCase().includes(String(farm.location ?? '').toLowerCase()),
    );
  };

  return (
    <AppFrame title="High-Priority Alerts" subtitle="Active disease alerts requiring immediate farmer contact and response.">
      <div className="space-y-5">
        {highAlerts.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <p className="panel-label">Active alerts</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">{highAlerts.length}</p>
                <p className="mt-2 text-sm text-text-mid">High severity cases</p>
              </Card>
              <Card>
                <p className="panel-label">Farmer contacts</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">{farms.length}</p>
                <p className="mt-2 text-sm text-text-mid">Available in your registry</p>
              </Card>
              <Card>
                <p className="panel-label">Status</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">{highAlerts.filter((a) => a.status === 'Active').length}</p>
                <p className="mt-2 text-sm text-text-mid">Awaiting response</p>
              </Card>
            </div>

            <Card>
              <p className="panel-label">Response queue</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Issues requiring contact</h2>
              <div className="mt-6 space-y-4">
                {highAlerts.map((alert) => {
                  const matchedFarm = getMatchedFarm(alert.locationName);
                  return (
                    <div key={alert.id} className="rounded-3xl border border-[#d9d4c8] bg-white p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="panel-label">{alert.id}</p>
                            <Badge variant="danger">High</Badge>
                          </div>
                          <p className="mt-3 text-base font-medium text-text-dark">{alert.disease} detected</p>
                          <p className="mt-2 text-sm text-text-mid">{alert.locationName} • {alert.crop} • {alert.confidence ?? 0}% confidence</p>
                          {matchedFarm && <p className="mt-2 text-sm text-moss font-medium">Farmer: {matchedFarm.owner}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                          {matchedFarm?.email && (
                            <a href={`mailto:${matchedFarm.email}?subject=${encodeURIComponent(`Alert: ${alert.disease} detected`)}&body=${encodeURIComponent(`High-priority alert: ${alert.disease} detected at ${alert.locationName}`)}`}>
                              <Button variant="secondary" className="justify-start">
                                <Mail className="h-4 w-4" />
                                Send email
                              </Button>
                            </a>
                          )}
                          {matchedFarm?.phone && (
                            <a href={`https://wa.me/${matchedFarm.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Alert: ${alert.disease} detected at ${alert.locationName}. Confidence: ${alert.confidence}%`)}`} target="_blank" rel="noreferrer">
                              <Button variant="secondary" className="justify-start">
                                <Phone className="h-4 w-4" />
                                WhatsApp
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        ) : (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-text-dark">No active alerts</h3>
              <p className="mt-2 text-sm text-text-mid">All monitored farms are healthy. Upload new analysis to check for disease trends.</p>
            </div>
          </Card>
        )}
      </div>
    </AppFrame>
  );
}

export default Alerts;
