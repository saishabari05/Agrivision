import { motion } from 'framer-motion';
import { Camera, CheckCircle2, FileDown, Leaf, LocateFixed, MapPin, Sprout } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import UploadDropzone from '../components/UploadDropzone';
import { useAuth } from '../context/AuthContext';
import { downloadReportPdf } from '../services/pdfService';
import { defaultLocations, detectCurrentLocation } from '../utils/location';
import { validateRequired } from '../utils/validation';

const crops = [
  { name: 'Tomato', icon: Leaf },
  { name: 'Apple', icon: Camera },
  { name: 'Grape', icon: Sprout },
];

const diseaseByCrop = {
  Tomato: { disease: 'Early Blight', severity: 'Moderate', confidence: 94 },
  Apple: { disease: 'Apple Scab', severity: 'High', confidence: 91 },
  Grape: { disease: 'Black Rot', severity: 'Low', confidence: 88 },
};

function UploadPage() {
  const { addReport, addUploadResult } = useAuth();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ crop: 'Tomato', location: defaultLocations[0] });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleDetectLocation = async () => {
    try {
      const result = await detectCurrentLocation();
      setForm((current) => ({ ...current, location: result.label }));
    } catch (error) {
      setErrors((current) => ({ ...current, location: error.message }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!file) nextErrors.file = 'Upload a crop image to continue.';
    if (!validateRequired(form.location)) nextErrors.location = 'Enter a location for this upload.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);

    window.setTimeout(() => {
      const result = diseaseByCrop[form.crop];
      const uploadRecord = {
        id: `upl-${Date.now()}`,
        crop: form.crop,
        locationName: form.location,
        uploadedAt: new Date().toISOString(),
        coordinates: [20.5937, 78.9629],
        ...result,
      };
      const reportRecord = {
        id: `rep-${Date.now()}`,
        crop: form.crop,
        locationName: form.location,
        reportDate: new Date().toISOString(),
        summary: `AI analysis indicates ${result.disease} with ${result.confidence}% confidence for the selected ${form.crop.toLowerCase()} leaf sample.`,
        recommendations: [
          'Inspect neighboring plants within the same irrigation block.',
          'Document environmental conditions before the next scan.',
          'Schedule follow-up treatment review in 3 to 5 days.',
        ],
        ...result,
      };

      addUploadResult(uploadRecord);
      addReport(reportRecord);
      setPrediction(reportRecord);
      setSubmitting(false);
    }, 1100);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <SectionHeading
        eyebrow="Upload"
        title="Analyze a crop image"
        description="This flow is ready to send image, crop, and location metadata to your backend prediction endpoint."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <UploadDropzone onFileSelect={setFile} file={file} />
          {errors.file && <p className="-mt-2 text-sm text-rose-600">{errors.file}</p>}

          <div className="glass-panel p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Crop selection</span>
                <select
                  value={form.crop}
                  onChange={(event) => setForm((current) => ({ ...current, crop: event.target.value }))}
                  className="field"
                >
                  {crops.map((crop) => (
                    <option key={crop.name} value={crop.name}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
                <div className="space-y-3">
                  <input
                    list="location-options"
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="field"
                    placeholder="Enter farm, plot, or region"
                  />
                  <datalist id="location-options">
                    {defaultLocations.map((location) => (
                      <option key={location} value={location} />
                    ))}
                  </datalist>
                  <Button type="button" variant="secondary" onClick={handleDetectLocation} className="w-full">
                    <LocateFixed className="h-4 w-4" />
                    Detect current location
                  </Button>
                </div>
                {errors.location && <p className="mt-2 text-sm text-rose-600">{errors.location}</p>}
              </label>
            </div>

            <Button type="submit" loading={submitting} className="mt-5 w-full">
              Submit to prediction API
            </Button>
          </div>
        </form>

        <div className="space-y-5">
          <div className="glass-panel p-5">
            <h2 className="text-xl font-bold text-slate-900">Supported crops</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {crops.map(({ name, icon: Icon }) => (
                <div key={name} className="rounded-3xl bg-earth-50 p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-800">{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5">
            <h2 className="text-xl font-bold text-slate-900">Prediction results</h2>
            {prediction ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3 rounded-3xl bg-emerald-50 p-4 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  Analysis complete and ready for report generation.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['Disease', prediction.disease],
                    ['Confidence', `${prediction.confidence}%`],
                    ['Severity', prediction.severity],
                    ['Location', prediction.locationName],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl bg-earth-50 p-4">
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl bg-moss-900 p-5 text-white">
                  <p className="text-sm uppercase tracking-[0.16em] text-white/70">AI summary</p>
                  <p className="mt-3 text-sm leading-7 text-white/85">{prediction.summary}</p>
                </div>
                <Button onClick={() => downloadReportPdf(prediction)} className="w-full">
                  <FileDown className="h-4 w-4" />
                  Generate and download PDF report
                </Button>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-earth-200 bg-white/70 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-earth-100 text-earth-700">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Upload a leaf image to preview disease name, confidence score, severity, and PDF report actions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadPage;

