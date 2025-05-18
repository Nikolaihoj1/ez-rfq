import { useState, useEffect } from 'react';
import OperationForm from './OperationForm';
import FileUpload from './FileUpload';

const defaultPart = {
  part_number: '',
  part_name: '',
  quantity: 1,
  description: '',
  material_cost: '',
  pdf_file: '',
  step_file: '',
  operations: [],
};

const defaultOperation = {
  process: '',
  setup_time: 0,
  programming_time: 0,
  first_part_time: 0,
  part_time: 0,
  external_days: '',
  external_cost: '',
};

export default function PartForm({ part, onChange, onRemove, onFileUpload }) {
  // Use part directly, only fallback to defaultPart if part is undefined
  const p = part ? { ...defaultPart, ...part, operations: Array.isArray(part.operations) ? part.operations : [] } : { ...defaultPart };

  // Hourly rate state (default 1000, can be edited per part)
  const [hourlyRate, setHourlyRate] = useState(p.hourly_rate || 1000);

  // Update parent if hourly rate changes
  useEffect(() => {
    if (p.hourly_rate !== hourlyRate) {
      onChange({ ...p, hourly_rate: hourlyRate });
    }
    // eslint-disable-next-line
  }, [hourlyRate]);

  // Calculate unit price (per part, not total)
  const calcUnitPrice = () => {
    const rate = Number(hourlyRate) || 0;
    const material = Number(p.material_cost) || 0;
    let opTotal = 0;
    (p.operations || []).forEach(op => {
      const setup = Number(op.setup_time) || 0;
      const prog = Number(op.programming_time) || 0;
      const first = Number(op.first_part_time) || 0;
      const partProd = Number(op.part_time) || 0;
      const extCost = Number(op.external_cost) || 0;
      opTotal += (setup + prog + first + partProd) * rate + extCost;
    });
    return (opTotal + material).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...p, [name]: value });
  };

  const handleOperationChange = (idx, op) => {
    const updatedOps = Array.isArray(p.operations) ? [...p.operations] : [];
    updatedOps[idx] = op;
    onChange({ ...p, operations: updatedOps });
  };

  const handleAddOperation = () => {
    const updatedOps = Array.isArray(p.operations) ? [...p.operations, { ...defaultOperation }] : [{ ...defaultOperation }];
    onChange({ ...p, operations: updatedOps });
  };

  const handleRemoveOperation = (idx) => {
    const updatedOps = Array.isArray(p.operations)
      ? p.operations.filter((_, i) => i !== idx)
      : [];
    onChange({ ...p, operations: updatedOps });
  };

  return (
    <div className="part-card">
      <div className="part-header">
        <h3>Part Details</h3>
        <button 
          type="button" 
          onClick={onRemove} 
          style={{ background: '#f44336', color: '#fff', marginTop: 0 }}
        >
          Remove Part
        </button>
      </div>

      <div className="part-content">
        <div className="part-grid">
          <div className="part-field">
            <label>Part Number</label>
            <input 
              name="part_number" 
              value={p.part_number} 
              onChange={handleChange} 
              placeholder="Part Number" 
            />
          </div>
          <div className="part-field">
            <label>Part Name</label>
            <input 
              name="part_name" 
              value={p.part_name} 
              onChange={handleChange} 
              placeholder="Part Name" 
            />
          </div>
          <div className="part-field">
            <label>Quantity</label>
            <input 
              name="quantity" 
              type="number" 
              min="1" 
              value={p.quantity} 
              onChange={handleChange} 
              placeholder="Qty" 
            />
          </div>
          <div className="part-field">
            <label>Material Cost</label>
            <input 
              name="material_cost" 
              type="number" 
              min="0" 
              value={p.material_cost} 
              onChange={handleChange} 
              placeholder="Material Cost" 
            />
          </div>
        </div>

        <div className="part-field" style={{ marginBottom: '1rem' }}>
          <label>Description</label>
          <input 
            name="description" 
            value={p.description} 
            onChange={handleChange} 
            placeholder="Description" 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>PDF File</label>
            <FileUpload 
              label="PDF" 
              accept="application/pdf" 
              onUpload={(file, formData) => onFileUpload(file, formData, 'pdf_file', p, onChange)} 
              existingFileUrl={p.pdf_file} 
            />
          </div>
          <div>
            <label>STEP File</label>
            <FileUpload 
              label="STEP" 
              accept=".step,.stp" 
              onUpload={(file, formData) => onFileUpload(file, formData, 'step_file', p, onChange)} 
              existingFileUrl={p.step_file} 
            />
          </div>
        </div>

        <div className="operations-section">
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Operations</h4>
          {(p.operations || []).map((op, idx) => (
            <div className="operation-card" key={idx}>
              <OperationForm 
                operation={op} 
                onChange={(o) => handleOperationChange(idx, o)} 
                onRemove={() => handleRemoveOperation(idx)} 
              />
            </div>
          ))}
          <button 
            type="button" 
            onClick={handleAddOperation} 
            style={{ background: '#43a047', color: '#fff', marginTop: '0.5rem' }}
          >
            Add Operation
          </button>
        </div>
      </div>
    </div>
  );
}
