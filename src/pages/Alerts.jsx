import { CheckCircle2, Mail, Phone, TriangleAlert, UserRound } from 'lucide-react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';

const alerts = [
  {
    id: 'ALT-401',
    severity: 'High',
    farm: 'Shimla Orchard Belt',
    crop: 'Apple',
    issue: 'Rapid apple scab spread detected in neighbouring rows',
    time: '12 minutes ago',
  },
  {
    id: 'ALT-397',
    severity: 'Moderate',
    farm: 'Nashik North Estate',
    crop: 'Tomato',
    issue: 'Disease progression suggests treatment follow-up required',
    time: '1 hour ago',
  },
  {
    id: 'ALT-392',
    severity: 'Low',
    farm: 'Pune Vineyard Cluster',
    crop: 'Grape',
    issue: 'Localized leaf stress detected near southern edge',
    time: 'Yesterday',
  },
];

const contacts = [
  {
    name: 'Priya Sharma',
    phone: '+91 98989 12345',
    email: 'priya@mistagri.com',
    farms: 'Shimla Orchard Belt, Valley South Plot',
    preferred: 'Phone call',
  },
  {
    name: 'Aarav Patel',
    phone: '+91 98765 43210',
    email: 'aarav@mistagri.com',
    farms: 'Nashik North Estate',
    preferred: 'WhatsApp / Call',
  },
];

function Alerts() {
  return (
    <AppFrame title="Alerts & Farmer Contacts" subtitle="Coordinate high-priority response, communicate with farmers, and resolve disease issues faster.">
      <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="panel-label">Active alerts</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Operational response queue</h2>
            </div>
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
              <TriangleAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-[#d9d4c8] bg-white px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="panel-label">{alert.id}</p>
                      <Badge variant={alert.severity === 'High' ? 'danger' : alert.severity === 'Moderate' ? 'warning' : 'success'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="mt-3 text-base font-medium text-text-dark">{alert.issue}</p>
                    <p className="mt-2 text-sm text-text-mid">
                      {alert.farm} • {alert.crop} • {alert.time}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary">View farm</Button>
                    <Button variant="ghost">Send alert</Button>
                    <Button variant="ghost">
                      <CheckCircle2 className="h-4 w-4" />
                      Resolved
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <p className="panel-label">Farmer contacts</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Communication panel</h3>
            <div className="mt-5 space-y-4">
              {contacts.map((contact) => (
                <div key={contact.email} className="rounded-3xl bg-beige px-5 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-white p-3 text-moss shadow-sm">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-text-dark">{contact.name}</p>
                        <p className="mt-1 text-sm text-text-mid">{contact.farms}</p>
                      </div>
                    </div>
                    <Badge variant="info">{contact.preferred}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-mid">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <p className="mt-2 font-medium text-text-dark">{contact.phone}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-mid">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="mt-2 font-medium text-text-dark">{contact.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="secondary">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="ghost">
                      <Mail className="h-4 w-4" />
                      Send alert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="panel-label">Response summary</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['09', 'Active alerts'],
                ['05', 'Contacts notified'],
                ['03', 'Awaiting follow-up'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-moss-pale px-4 py-4">
                  <p className="text-2xl font-bold tracking-[-0.03em] text-text-dark">{value}</p>
                  <p className="mt-1 text-sm text-text-mid">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

export default Alerts;
