import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { previewProfile, reports, updateProfile, uploads } = useAuth();
  const [tab, setTab] = useState('uploads');
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: previewProfile?.name ?? '',
    email: previewProfile?.email ?? '',
    farmName: previewProfile?.farmName ?? '',
    location: previewProfile?.location ?? '',
  });

  useEffect(() => {
    setForm({
      name: previewProfile?.name ?? '',
      email: previewProfile?.email ?? '',
      farmName: previewProfile?.farmName ?? '',
      location: previewProfile?.location ?? '',
    });
  }, [previewProfile]);

  const handleSave = async () => {
    await updateProfile(form);
    setEdit(false);
  };

  return (
    <AppFrame title="Profile" subtitle="Manage your account details, uploads, and report history.">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-moss text-2xl font-semibold text-white">
              {previewProfile?.name?.slice(0, 2)?.toUpperCase() ?? 'AV'}
            </div>
            <div>
              <h2 className="text-4xl">{previewProfile?.name ?? 'Aarav Patel'}</h2>
              <p className="mt-2 text-text-mid">{previewProfile?.email ?? 'aarav@agrivision.ai'}</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => (edit ? handleSave() : setEdit(true))}>
            <Pencil className="h-4 w-4" />
            {edit ? 'Save' : 'Edit'}
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ['Name', previewProfile?.name ?? 'Aarav Patel'],
            ['Email', previewProfile?.email ?? 'aarav@agrivision.ai'],
            ['Farm Name', previewProfile?.farmName ?? 'Green Horizon Farms'],
            ['Location', previewProfile?.location ?? 'Nashik, Maharashtra'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-beige p-4">
              <p className="text-sm text-text-muted">{label}</p>
              {edit ? (
                <input
                  value={form[label === 'Name' ? 'name' : label === 'Email' ? 'email' : label === 'Farm Name' ? 'farmName' : 'location']}
                  onChange={(event) => {
                    const key = label === 'Name' ? 'name' : label === 'Email' ? 'email' : label === 'Farm Name' ? 'farmName' : 'location';
                    setForm((current) => ({ ...current, [key]: event.target.value }));
                  }}
                  className="field mt-2"
                />
              ) : (
                <p className="mt-2 text-lg text-text-dark">{value}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 flex gap-3">
        <Button variant={tab === 'uploads' ? 'primary' : 'secondary'} onClick={() => setTab('uploads')}>
          Upload History
        </Button>
        <Button variant={tab === 'reports' ? 'primary' : 'secondary'} onClick={() => setTab('reports')}>
          My Reports
        </Button>
      </div>

      {tab === 'uploads' ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {uploads.map((item) => (
            <Card key={item.id}>
              <div className="h-44 rounded-3xl bg-beige" />
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-text-dark">{item.crop} scan</p>
                  <p className="mt-1 text-sm text-text-muted">{new Date(item.uploadedAt).toLocaleDateString()}</p>
                </div>
                <Badge>{item.severity}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-text-muted">{report.id}</p>
                  <h3 className="mt-2 text-3xl">{report.crop} disease report</h3>
                </div>
                <Badge variant="info">Saved</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppFrame>
  );
}

export default Profile;

