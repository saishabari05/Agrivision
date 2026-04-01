import { motion } from 'framer-motion';
import { ImagePlus, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function UploadZone({ file, onFileSelect }) {
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) onFileSelect(acceptedFiles[0]);
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      animate={isDragActive ? { scale: [1, 1.01, 1], borderColor: ['#3d6b45', '#5a8f64', '#3d6b45'] } : {}}
      transition={{ duration: 1.2, repeat: isDragActive ? Infinity : 0 }}
      className={`surface cursor-pointer border-2 border-dashed p-8 text-center ${isDragActive ? 'bg-moss-pale/60' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-moss-pale text-moss">
        {file ? <ImagePlus className="h-7 w-7" /> : <UploadCloud className="h-7 w-7" />}
      </div>
      <h3 className="mt-5 text-3xl text-text-dark">{file ? file.name : 'Drop your crop image here'}</h3>
      <p className="mt-3 text-sm leading-7 text-text-mid">
        Drag and drop a clear leaf image or browse from your device to start AI-powered disease analysis.
      </p>
      {file && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-moss/10">
          <img src={URL.createObjectURL(file)} alt={file.name} className="h-72 w-full object-cover" />
        </div>
      )}
    </motion.div>
  );
}

export default UploadZone;

