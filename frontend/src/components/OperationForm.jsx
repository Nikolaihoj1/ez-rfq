const defaultOperation = {
  process: '',
  setup_time: 0,
  programming_time: 0,
  first_part_time: 0,
  part_time: 0,
  external_days: '',
  external_cost: '',
};

const processOptions = [
  'milling 3axis',
  'milling 5 axis',
  'turning',
  'welding',
  'grinding',
  'manual labor',
  'external',
];

export default function OperationForm({ operation, onChange, onRemove }) {
  const op = { ...defaultOperation, ...operation };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...op, [name]: value });
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, rowGap: 0, alignItems: 'flex-end', marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 180, marginBottom: 12 }}>
          <label>Process</label>
          <select name="process" value={op.process} onChange={handleChange} required style={{ width: '100%' }}>
            <option value="">Select process</option>
            {processOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 140, marginBottom: 12 }}>
          <label>Setup (hours)</label>
          <input name="setup_time" type="number" min="0" step="0.1" value={op.setup_time} onChange={handleChange} placeholder="Setup (hours)" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 140, marginBottom: 12 }}>
          <label>Programming (hours)</label>
          <input name="programming_time" type="number" min="0" step="0.1" value={op.programming_time} onChange={handleChange} placeholder="Programming (hours)" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 140, marginBottom: 12 }}>
          <label>First part (hours)</label>
          <input name="first_part_time" type="number" min="0" step="0.1" value={op.first_part_time} onChange={handleChange} placeholder="First part (hours)" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 140, marginBottom: 12 }}>
          <label>Part prod. (hours)</label>
          <input name="part_time" type="number" min="0" step="0.1" value={op.part_time} onChange={handleChange} placeholder="Part prod. (hours)" style={{ width: '100%' }} />
        </div>
        {op.process === 'external' && (
          <>
            <div style={{ flex: 1, minWidth: 100, marginBottom: 12 }}>
              <label>External Days</label>
              <input name="external_days" type="number" min="0" step="1" value={op.external_days || ''} onChange={handleChange} placeholder="Days" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1, minWidth: 120, marginBottom: 12 }}>
              <label>External Cost</label>
              <input name="external_cost" type="number" min="0" step="0.01" value={op.external_cost || ''} onChange={handleChange} placeholder="Cost" style={{ width: '100%' }} />
            </div>
          </>
        )}
        <div style={{ flex: '0 0 auto', alignSelf: 'center', marginTop: 18, marginBottom: 12 }}>
          <button type="button" onClick={onRemove} style={{ background: '#f44336', color: '#fff' }}>Remove</button>
        </div>
      </div>
    </div>
  );
}
