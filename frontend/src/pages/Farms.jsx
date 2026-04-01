import { motion } from 'framer-motion';
import { LandPlot, MapPin, Mail, Pencil, Phone, Plus, Trash2, Wheat } from 'lucide-react';
import { useMemo, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const emptyFarmForm = {
  name: '',
  owner: '',
  crop: 'Tomato',
  acreage: '',
  location: '',
  risk: 'Moderate',
  alerts: '0',
  phone: '',
  email: '',
};

function Farms() {
  const { farms, createFarm, updateFarm, deleteFarm } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [editingFarm, setEditingFarm] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyFarmForm);

  const filteredFarms = useMemo(() => {
    return farms.filter((farm) => {
      const haystack = `${farm.name} ${farm.owner} ${farm.location} ${farm.crop}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [farms, query]);

  const openCreate = () => {
    setEditingFarm(null);
    setForm(emptyFarmForm);
    setError('');
    setIsFormOpen(true);
  };

  const openEdit = (farm) => {
    setEditingFarm(farm);
    setForm({
      name: farm.name ?? '',
      owner: farm.owner ?? '',
      crop: farm.crop ?? 'Tomato',
      acreage: farm.acreage ?? '',
      location: farm.location ?? '',
      risk: farm.risk ?? 'Moderate',
      alerts: String(farm.alerts ?? 0),
      phone: farm.phone ?? '',
      email: farm.email ?? '',
    });
    setError('');
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.owner.trim() || !form.location.trim() || !form.crop.trim()) {
      setError('Farm name, owner, crop, and location are required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      owner: form.owner.trim(),
      crop: form.crop.trim(),
      acreage: form.acreage.trim() || '0 acres',
      location: form.location.trim(),
      risk: form.risk,
      alerts: Number(form.alerts || 0),
      phone: form.phone.trim(),
      email: form.email.trim(),
      updated: 'Updated just now',
    };

    try {
      if (editingFarm) {
        await updateFarm(editingFarm.id, payload);
      } else {
        await createFarm(payload);
      }
      setIsFormOpen(false);
    } catch (saveError) {
      setError(saveError.message || 'Unable to save farm.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (farm) => {
    await updateFarm(farm.id, { archived: true, updated: 'Archived just now' });
  };

  const handleDelete = async (farm) => {
    await deleteFarm(farm.id);
    if (selectedFarm?.id === farm.id) {
      setSelectedFarm(null);
    }
  };

  return (
    <AppFrame title="Farm Registry" subtitle="Manage client farms, contact details, acreage, and risk status in one clean workspace.">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="panel-label">Client farms</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Track every farm you monitor</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field min-w-[260px]"
                placeholder="Search by farm, owner, crop, or location"
              />
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add farm
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-2">
          {filteredFarms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={farm.archived ? 'opacity-70' : ''}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="panel-label">{farm.id}</p>
                      <Badge variant={farm.risk === 'High' ? 'danger' : farm.risk === 'Moderate' ? 'warning' : 'success'}>
                        {farm.archived ? 'Archived' : `${farm.risk} risk`}
                      </Badge>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text-dark">{farm.name}</h3>
                    <p className="mt-1 text-sm text-text-mid">Managed by {farm.owner}</p>
                  </div>
                  <div className="rounded-2xl bg-moss-pale p-3 text-moss">
                    <LandPlot className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-beige px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-mid">
                      <Wheat className="h-4 w-4" />
                      Crop
                    </div>
                    <p className="mt-2 font-medium text-text-dark">{farm.crop}</p>
                  </div>
                  <div className="rounded-2xl bg-beige px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-text-mid">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="mt-2 font-medium text-text-dark">{farm.location}</p>
                  </div>
                  <div className="rounded-2xl bg-beige px-4 py-4">
                    <p className="text-sm text-text-mid">Acreage</p>
                    <p className="mt-2 font-medium text-text-dark">{farm.acreage}</p>
                  </div>
                  <div className="rounded-2xl bg-beige px-4 py-4">
                    <p className="text-sm text-text-mid">Active alerts</p>
                    <p className="mt-2 font-medium text-text-dark">{farm.alerts}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-text-muted">{farm.updated}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => setSelectedFarm(farm)}>
                      View
                    </Button>
                    <Button variant="ghost" onClick={() => openEdit(farm)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => handleArchive(farm)}>
                      <Trash2 className="h-4 w-4" />
                      Archive
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(farm)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {!filteredFarms.length && (
          <Card>
            <p className="text-sm text-text-mid">No farms found. Add a client farm to start tracking acreage, location, and alerts.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={Boolean(selectedFarm)} onClose={() => setSelectedFarm(null)} title="Farm details">
        {selectedFarm && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Farm', selectedFarm.name],
                ['Owner', selectedFarm.owner],
                ['Primary crop', selectedFarm.crop],
                ['Acreage', selectedFarm.acreage],
                ['Location', selectedFarm.location],
                ['Active alerts', String(selectedFarm.alerts)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-beige px-4 py-4">
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className="mt-2 font-medium text-text-dark">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-moss-pale p-5">
              <p className="panel-label text-moss">Contact</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-3 text-moss">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-text-dark">{selectedFarm.phone || 'No phone added'}</p>
                    <p className="text-sm text-text-mid">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-3 text-moss">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-text-dark">{selectedFarm.email || 'No email added'}</p>
                    <p className="text-sm text-text-mid">Email</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedFarm.email && (
                    <a href={`mailto:${selectedFarm.email}`}>
                      <Button variant="secondary">Send email</Button>
                    </a>
                  )}
                  {selectedFarm.phone && (
                    <a href={`https://wa.me/${selectedFarm.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                      <Button variant="secondary">WhatsApp</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingFarm ? 'Edit farm' : 'Add farm'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="field" placeholder="Farm name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            <input className="field" placeholder="Owner / manager" value={form.owner} onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))} />
            <input className="field" placeholder="Crop type" value={form.crop} onChange={(event) => setForm((current) => ({ ...current, crop: event.target.value }))} />
            <input className="field" placeholder="Acreage" value={form.acreage} onChange={(event) => setForm((current) => ({ ...current, acreage: event.target.value }))} />
            <input className="field sm:col-span-2" placeholder="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
            <select className="field" value={form.risk} onChange={(event) => setForm((current) => ({ ...current, risk: event.target.value }))}>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
            <input className="field" placeholder="Active alerts" value={form.alerts} onChange={(event) => setForm((current) => ({ ...current, alerts: event.target.value }))} />
            <input className="field" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <input className="field" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </div>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save farm'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppFrame>
  );
}

export default Farms;
