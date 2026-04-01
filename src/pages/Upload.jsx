import { motion } from 'framer-motion';
import { Calendar, Download, MapPin, NotebookText } from 'lucide-react';
import { useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import UploadZone from '../components/UploadZone';

const mockResults = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: '94%',
    severity: 'Moderate',
    action: 'Apply a fungicide rotation and reduce overhead irrigation.',
  },
  {
    crop: 'Tomato',
    disease: 'Leaf Spot',
    confidence: '88%',
    severity: 'Low',
    action: 'Monitor lower leaves and improve row ventilation.',
  },
];

function Upload() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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
              <input className="field" placeholder="Enter farm or plot location" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                <Calendar className="h-4 w-4" />
                Capture date
              </span>
              <input type="date" className="field" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                <NotebookText className="h-4 w-4" />
                Notes
              </span>
              <textarea rows="5" className="field resize-none" placeholder="Add crop observations or context..." />
            </label>
            <Button className="w-full" onClick={() => setSubmitted(true)}>
              Submit for AI analysis
            </Button>
          </div>
        </Card>
      </div>

      {submitted && (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {mockResults.map((result) => (
              <Card key={result.disease}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-text-muted">{result.crop}</p>
                    <h3 className="mt-3 text-3xl">{result.disease}</h3>
                  </div>
                  <Badge variant={result.severity === 'Moderate' ? 'warning' : 'success'}>{result.severity}</Badge>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-beige p-4">
                    <p className="text-sm text-text-muted">Confidence</p>
                    <p className="mt-2 text-3xl text-moss">{result.confidence}</p>
                  </div>
                  <div className="rounded-2xl bg-beige p-4">
                    <p className="text-sm text-text-muted">Recommended action</p>
                    <p className="mt-2 text-sm leading-6 text-text-mid">{result.action}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button className="mt-6">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </motion.div>
      )}
    </AppFrame>
  );
}

export default Upload;
