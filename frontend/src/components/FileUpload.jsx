import { useRef } from 'react';

export default function FileUpload({ label, accept, onUpload, existingFileUrl }) {
  const inputRef = useRef();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append(label.toLowerCase(), file);
    // Only one file at a time, so we use the same key for both PDF and STEP
    onUpload(file, formData);
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <label>{label}: <input ref={inputRef} type="file" accept={accept} onChange={handleChange} /></label>
      {existingFileUrl && (
        <a href={existingFileUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
          Download
        </a>
      )}
    </div>
  );
}
