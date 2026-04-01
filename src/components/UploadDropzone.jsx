import { motion } from 'framer-motion';
import { ImagePlus, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function UploadDropzone({ onFileSelect, file }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      {...getRootProps()}
      className={`glass-panel cursor-pointer border-2 border-dashed p-8 text-center transition ${
        isDragActive ? 'border-moss-500 bg-moss-50' : 'border-earth-200'
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-moss-100 text-moss-700">
        {file ? <ImagePlus className="h-7 w-7" /> : <Upload className="h-7 w-7" />}
      </div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">
        {file ? file.name : 'Drag and drop a leaf image'}
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        Upload a clear close-up to analyze disease patterns and generate treatment-ready reports.
      </p>
      <p className="mt-4 text-sm font-semibold text-moss-700">Browse files</p>
    </motion.div>
  );
}

export default UploadDropzone;

