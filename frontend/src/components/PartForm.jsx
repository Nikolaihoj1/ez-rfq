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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Part</h3>
        <button type="button" onClick={onRemove} style={{ background: '#f44336', color: '#fff', marginTop: 0 }}>Remove Part</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, rowGap: 0, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 220, marginBottom: 18 }}>
          <label>Part Number</label>
          <input name="part_number" value={p.part_number} onChange={handleChange} placeholder="Part Number" />
        </div>
        <div style={{ flex: 1, minWidth: 220, marginBottom: 18 }}>
          <label>Part Name</label>
          <input name="part_name" value={p.part_name} onChange={handleChange} placeholder="Part Name" />
        </div>
        <div style={{ flex: 1, minWidth: 120, marginBottom: 18 }}>
          <label>Quantity</label>
          <input name="quantity" type="number" min="1" value={p.quantity} onChange={handleChange} placeholder="Qty" />
        </div>
        <div style={{ flex: 1, minWidth: 160, marginBottom: 18 }}>
          <label>Material Cost</label>
          <input name="material_cost" type="number" min="0" value={p.material_cost} onChange={handleChange} placeholder="Material Cost" />
        </div>
        <div style={{ flex: 2, minWidth: 220, marginBottom: 18 }}>
          <label>Description</label>
          <input name="description" value={p.description} onChange={handleChange} placeholder="Description" />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, rowGap: 0, marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 220, marginBottom: 18 }}>
          <label>PDF File (optional)</label>
          <FileUpload label="PDF" accept="application/pdf" onUpload={(file, formData) => onFileUpload(file, formData, 'pdf_file', p, onChange)} existingFileUrl={p.pdf_file} />
        </div>
        <div style={{ flex: 1, minWidth: 220, marginBottom: 18 }}>
          <label>STEP File (optional)</label>
          <FileUpload label="STEP" accept=".step,.stp" onUpload={(file, formData) => onFileUpload(file, formData, 'step_file', p, onChange)} existingFileUrl={p.step_file} />
        </div>
        <div style={{ flex: 1, minWidth: 180, alignSelf: 'flex-end', marginBottom: 18 }}>
          <label>Hourly Rate (kr)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={hourlyRate}
            onChange={e => setHourlyRate(e.target.value)}
            style={{ width: 100 }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 180, alignSelf: 'flex-end', marginBottom: 18 }}>
          <label>Unit Price</label>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#1976d2', marginTop: 4 }}>{calcUnitPrice()} kr</div>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <b style={{ fontSize: 16 }}>Operations:</b>
        {(p.operations || []).map((op, idx) => (
          <div className="operation-card" key={idx}>
            <OperationForm operation={op} onChange={(o) => handleOperationChange(idx, o)} onRemove={() => handleRemoveOperation(idx)} />
          </div>
        ))}
        <button type="button" onClick={handleAddOperation} style={{ background: '#43a047', color: '#fff', marginTop: 8 }}>Add Operation</button>
      </div>
    </div>
  );
}
