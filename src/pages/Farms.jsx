import { AnimatePresence, motion } from 'framer-motion';
import {
  LandPlot,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Wheat,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';

const farms = [
  {
    id: 'FRM-101',
    name: 'Nashik North Estate',
    owner: 'Aarav Patel',
    crop: 'Tomato',
    acreage: '840 acres',
    location: 'Nashik, Maharashtra',
    risk: 'Moderate',
    alerts: 3,
    phone: '+91 98765 43210',
    updated: 'Updated 2 hours ago',
  },
  {
    id: 'FRM-102',
    name: 'Shimla Orchard Belt',
    owner: 'Priya Sharma',
    crop: 'Apple',
    acreage: '1,240 acres',
    location: 'Shimla, Himachal Pradesh',
    risk: 'High',
    alerts: 5,
    phone: '+91 98989 12345',
    updated: 'Updated 45 minutes ago',
  },
  {
    id: 'FRM-103',
    name: 'Pune Vineyard Cluster',
    owner: 'Rohan Deshmukh',
    crop: 'Grape',
    acreage: '920 acres',
    location: 'Pune, Maharashtra',
    risk: 'Low',
    alerts: 1,
    phone: '+91 98888 76543',
    updated: 'Updated yesterday',
  },
];

function Farms() {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [query, setQuery] = useState('');

  const filteredFarms = useMemo(
    () =>
      farms.filter((farm) =>
        `${farm.name} ${farm.owner} ${farm.location} ${farm.crop}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <AppFrame title="Farm Management" subtitle="Add, organize, and monitor farms with clear ownership, risk, and operational context.">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="panel-label">Farm registry</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Manage active agricultural sites</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field min-w-[260px]"
                placeholder="Search farms, owners, crop, or location"
              />
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" />
                Add Farm
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
              transition={{ delay: index * 0.06 }}
            >
              <Card className={farm.risk === 'High' ? 'border-rose-200 bg-rose-50/40' : ''}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="panel-label">{farm.id}</p>
                      <Badge variant={farm.risk === 'High' ? 'danger' : farm.risk === 'Moderate' ? 'warning' : 'success'}>
                        {farm.risk} risk
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
                    <Button variant="ghost">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost">
                      <Trash2 className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
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
                <div key={label} className="rounded-2xl bg-beige px-4 py-4">
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className="mt-2 font-medium text-text-dark">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-moss-pale p-5">
              <p className="panel-label text-moss">Contact</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="rounded-full bg-white p-3 text-moss">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-text-dark">{selectedFarm.owner}</p>
                  <p className="text-sm text-text-mid">{selectedFarm.phone}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-text-dark/35 p-4 backdrop-blur-sm"
          >
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="surface w-full max-w-2xl p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-text-dark">Create new farm</h3>
                <button onClick={() => setShowCreate(false)} className="rounded-full bg-moss-pale p-2 text-moss">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="field" placeholder="Farm name" />
                <input className="field" placeholder="Owner / manager" />
                <input className="field" placeholder="Crop type" />
                <input className="field" placeholder="Acreage" />
                <input className="field sm:col-span-2" placeholder="Location" />
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button onClick={() => setShowCreate(false)}>Save farm</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppFrame>
  );
}

export default Farms;

