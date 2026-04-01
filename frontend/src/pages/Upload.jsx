import { motion } from 'framer-motion';
import { Calendar, Download, MapPin, NotebookText } from 'lucide-react';
import { useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import UploadZone from '../components/UploadZone';
import { useAuth } from '../context/AuthContext';
import { generateReport, uploadLeafImage } from '../services/api';

function Upload() {
  const { addReport, addUploadResult, farms } = useAuth();
  const locationOptions = Array.from(
    new Set([
      ...farms.map((farm) => farm.location).filter(Boolean),
      'Mangaluru, Karnataka',
      'Shimla, Himachal Pradesh',
      'Nashik, Maharashtra',
      'Pune, Maharashtra',
      'Bengaluru, Karnataka',
    ]),
  );
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ crop: 'Tomato', location: '', date: '', notes: '' });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('location', form.location);

      const response = await uploadLeafImage(formData);

      const uploadRecord = {
        id: response.session_id,
        crop: response.crop,
        disease: response.disease,
        severity: response.severity,
        confidence: Number((response.confidence * 100).toFixed(2)),
        locationName: response.location || form.location || 'Unknown',
        coordinates: [response?.lat ?? null, response?.lon ?? null],
        uploadedAt: new Date().toISOString(),
      };
      addUploadResult(uploadRecord);

      const reportRecord = await generateReport({
        crop: response.crop,
        disease: response.disease,
        severity: response.severity,
        confidence: Number((response.confidence * 100).toFixed(2)),
        locationName: response.location || form.location || 'Unknown',
        recommendation: response.recommendation,
        summary: response.recommendation,
        sessionId: response.session_id,
      });
      addReport(reportRecord);

      window.localStorage.setItem('agrivision_last_session_id', response.session_id);
      setResult({ ...response, confidencePercent: Number((response.confidence * 100).toFixed(2)) });
      setSubmitted(true);
    } catch (apiError) {
      setError(apiError.message || 'Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppFrame title="Upload & Analyze" subtitle="Add field imagery and metadata, then review AI predictions in a structured flow.">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <UploadZone file={file} onFileSelect={setFile} />

        <Card>
          <h2 className="text-4xl">Image details</h2>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-text-mid">Crop type</span>
              <select className="field">
                <option>Tomato</option>
                <option>Apple</option>
                <option>Grape</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                <MapPin className="h-4 w-4" />
                Location
              </span>
              <div className="space-y-2">
                <input
                  list="location-options"
                  className="field"
                  placeholder="Choose or type a location"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                />
                <datalist id="location-options">
                  {locationOptions.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                <Calendar className="h-4 w-4" />
                Capture date
              </span>
              <input
                type="date"
                className="field"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                <NotebookText className="h-4 w-4" />
                Notes
              </span>
              <textarea
                rows="5"
                className="field resize-none"
                placeholder="Add crop observations or context..."
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              />
            </label>
            {error && <p className="text-sm text-rose-700">{error}</p>}
            <Button className="w-full" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Analyzing...' : 'Submit for AI analysis'}
            </Button>
          </div>
        </Card>
      </div>

      {submitted && result && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">{result.crop}</p>
                    <h3 className="mt-3 text-3xl">{result.disease}</h3>
                  </div>
                  <Badge variant={String(result.severity).toLowerCase() === 'moderate' ? 'warning' : 'success'}>{result.severity}</Badge>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 auto-rows-fr">
                  <div className="flex flex-col rounded-2xl bg-beige p-4">
                    <p className="text-sm text-text-muted">Confidence</p>
                    <p className="mt-2 text-3xl text-moss">{result.confidencePercent}%</p>
                  </div>
                  <div className="flex flex-col rounded-2xl bg-beige p-4">
                    <p className="text-sm text-text-muted">Recommended action</p>
                    <p className="mt-2 flex-1 text-sm leading-6 text-text-mid overflow-y-auto">{result.recommendation}</p>
                  </div>
                </div>
              </Card>
          </div>
          <Button className="mt-6">
            <Download className="h-4 w-4" />
            Report generated in backend
          </Button>
        </motion.div>
      )}
    </AppFrame>
  );
}

export default Upload;
