import { useState, useEffect } from 'react';
import PartForm from './components/PartForm';
import './App.css';

const defaultOperation = {
  process: '',
  setup_time: 0,
  programming_time: 0,
  first_part_time: 0,
  part_time: 0,
  external_days: '',
  external_cost: '',
};

function HomePage({ quotes, onNewQuote, clients, onViewQuote }) {
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>HMT-EZQ - Ravnsgaard Metal</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button onClick={onNewQuote} style={{ background: '#43a047', color: '#fff', fontWeight: 600 }}>New Quote</button>
      </div>
      <h2 style={{ textAlign: 'center', color: '#374151' }}>Sent Quotes</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Client</th>
              <th>Sender</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid #e3e6ea' }}>
                <td>{q.quote_number}</td>
                <td>{q.client}</td>
                <td>{q.sender}</td>
                <td>{q.created_at?.slice(0, 10)}</td>
                <td><button onClick={() => onViewQuote(q.id)} style={{ background: '#1976d2', color: '#fff' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QuoteDetail({ quoteId, onBack }) {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:8000/quotes/${quoteId}`)
      .then(res => res.json())
      .then(setQuote);
  }, [quoteId]);
  if (!quote) return <div>Loading...</div>;

  // Helper to calculate unit price for a part (matches PartForm)
  const calcUnitPrice = (p) => {
    const rate = Number(p.hourly_rate) || 1000;
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

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 24 }}>HMT-EZQ - Ravnsgaard Metal</h1>
      <button onClick={onBack} style={{ marginBottom: 16 }}>Back</button>
      <h2>Quote #{quote.quote_number}</h2>
      <table style={{ marginBottom: 16 }}>
        <tbody>
          <tr><td><b>Client</b></td><td>{quote.client}</td></tr>
          <tr><td><b>Sender</b></td><td>{quote.sender}</td></tr>
          <tr><td><b>Date</b></td><td>{quote.created_at?.slice(0, 10)}</td></tr>
        </tbody>
      </table>
      <h3>Parts</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr>
            <th>Part #</th><th>Name</th><th>Qty</th><th>Material Cost</th><th>Description</th><th>PDF</th><th>STEP</th><th>Hourly Rate</th><th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {quote.parts.map((p, i) => (
            <tr key={i}>
              <td>{p.part_number}</td>
              <td>{p.part_name}</td>
              <td>{p.quantity}</td>
              <td>{p.material_cost}</td>
              <td>{p.description}</td>
              <td>{p.pdf_file && <a href={p.pdf_file} target="_blank" rel="noopener noreferrer">PDF</a>}</td>
              <td>{p.step_file && <a href={p.step_file} target="_blank" rel="noopener noreferrer">STEP</a>}</td>
              <td>{p.hourly_rate || 1000}</td>
              <td>{calcUnitPrice(p)} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Operations</h3>
      {quote.parts.map((p, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <b>Part: {p.part_number} - {p.part_name}</b>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Process</th><th>Setup (hours)</th><th>Programming (hours)</th><th>First Part (hours)</th><th>Part Time (hours)</th><th>External Days</th><th>External Cost</th>
              </tr>
            </thead>
            <tbody>
              {(p.operations || []).map((op, j) => (
                <tr key={j}>
                  <td>{op.process}</td>
                  <td>{op.setup_time}</td>
                  <td>{op.programming_time}</td>
                  <td>{op.first_part_time}</td>
                  <td>{op.part_time}</td>
                  <td>{op.external_days}</td>
                  <td>{op.external_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function QuoteForm({ clients, senders, onBack }) {
  const [quote, setQuote] = useState({
    quote_number: '',
    client: null,
    sender: null,
    parts: [],
  });
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSenderForm, setShowSenderForm] = useState(false);
  const [newClient, setNewClient] = useState({ 
    company_name: '', 
    company_address: '', 
    company_email: '', 
    town: '',
    contact: '' 
  });
  const [newSender, setNewSender] = useState({ 
    company_name: '', 
    company_address: '', 
    company_email: '',
    town: '',
    contact: ''
  });
  const [clientList, setClientList] = useState(clients);
  const [senderList, setSenderList] = useState(senders);

  useEffect(() => { setClientList(clients); }, [clients]);
  useEffect(() => { setSenderList(senders); }, [senders]);

  useEffect(() => {
    const fetchQuoteNumber = async () => {
      try {
        const res = await fetch('http://localhost:8000/quotes/next-number/', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch quote number');
        }
        const data = await res.json();
        setQuote(q => ({ ...q, quote_number: data.next_quote_number }));
      } catch (err) {
        console.error('Error fetching quote number:', err);
        // Set a default quote number if fetch fails
        setQuote(q => ({ ...q, quote_number: '1000' }));
      }
    };
    fetchQuoteNumber();
  }, []);

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setQuote(prev => ({ ...prev, client: parseInt(clientId) }));
  };

  const handleSenderSelect = (e) => {
    const senderId = e.target.value;
    setQuote(prev => ({ ...prev, sender: parseInt(senderId) }));
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/clients/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient),
    });
    const data = await res.json();
    setClientList(list => [...list, data]);
    setShowClientForm(false);
    setNewClient({ company_name: '', company_address: '', company_email: '' });
  };

  const handleAddSender = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/senders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSender),
    });
    const data = await res.json();
    setSenderList(list => [...list, data]);
    setShowSenderForm(false);
    setNewSender({ company_name: '', company_address: '', company_email: '' });
  };

  const handlePartChange = (idx, part) => {
    setQuote((prev) => {
      const updated = { ...prev };
      updated.parts[idx] = part;
      return updated;
    });
  };

  const handleAddPart = () => {
    setQuote((prev) => ({ ...prev, parts: [...prev.parts, { operations: [{ ...defaultOperation }] }] }));
  };

  const handleRemovePart = (idx) => {
    setQuote((prev) => ({ ...prev, parts: prev.parts.filter((_, i) => i !== idx) }));
  };

  // File upload handler
  const handleFileUpload = async (file, formData, field, part, setPart) => {
    if (field === 'pdf_file') formData.append('step', new Blob());
    if (field === 'step_file') formData.append('pdf', new Blob());
    const res = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data[field.replace('_file', '')]) {
      setPart((prev) => ({ ...prev, [field]: `http://localhost:8000/${data[field.replace('_file', '')]}` }));
    }
  };

  // Utility to sanitize numeric fields
  function sanitizeQuoteData(quote) {
    // Helper to convert empty string to null or number
    const toNumberOrNull = (val) => {
      if (val === '' || val === undefined) return null;
      if (typeof val === 'number') return val;
      const n = Number(val);
      return isNaN(n) ? null : n;
    };
    return {
      ...quote,
      parts: (quote.parts || []).map(part => ({
        ...part,
        quantity: toNumberOrNull(part.quantity),
        material_cost: toNumberOrNull(part.material_cost),
        operations: (part.operations || []).map(op => ({
          ...op,
          setup_time: toNumberOrNull(op.setup_time),
          programming_time: toNumberOrNull(op.programming_time),
          first_part_time: toNumberOrNull(op.first_part_time),
          part_time: toNumberOrNull(op.part_time),
          external_days: toNumberOrNull(op.external_days),
          external_cost: toNumberOrNull(op.external_cost),
        }))
      }))
    };
  }

  // Utility to validate quote
  function validateQuote(quote) {
    if (!quote.client) return 'Client is required.';
    if (!quote.sender) return 'Sender is required.';
    if (!quote.parts || quote.parts.length === 0) return 'At least one part is required.';
    for (let i = 0; i < quote.parts.length; i++) {
      const part = quote.parts[i];
      if (!part.part_number) return `Part #${i + 1}: Part number is required.`;
      if (!part.part_name) return `Part #${i + 1}: Part name is required.`;
      if (!part.operations || part.operations.length === 0) return `Part #${i + 1}: At least one operation is required.`;
      for (let j = 0; j < part.operations.length; j++) {
        const op = part.operations[j];
        if (!op.process) return `Part #${i + 1}, Operation #${j + 1}: Process is required.`;
      }
    }
    return null;
  }

  // Add save handler
  const handleSaveQuote = async () => {
    const validationError = validateQuote(quote);
    if (validationError) {
      alert('Cannot save: ' + validationError);
      return;
    }
    const sanitized = sanitizeQuoteData(quote);
    try {
      const res = await fetch('http://localhost:8000/quotes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
      });
      if (!res.ok) throw new Error('Failed to save quote');
      const data = await res.json();
      alert('Quote saved! Quote number: ' + data.quote_number);
      onBack(); // Go back to home after save
    } catch (err) {
      alert('Error saving quote: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>HMT-EZQ - Ravnsgaard Metal</h1>
      <button onClick={onBack} style={{ marginBottom: 16, background: '#f44336', color: '#fff' }}>Back</button>
      <h2 style={{ textAlign: 'center', color: '#374151' }}>New Quote</h2>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <input name="quote_number" value={quote.quote_number} readOnly placeholder="Quote Number" style={{ width: 120, marginRight: 8 }} />
          <div className="form-row">
            <div className="form-col">
              <label>Client:</label>
              <select value={quote.client || ''} onChange={handleClientSelect}>
                <option value="">Select Client</option>
                {clientList.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name}</option>
                ))}
              </select>
              <button type="button" onClick={() => setShowClientForm(true)}>Add New Client</button>
            </div>

            <div className="form-col">
              <label>Sender:</label>
              <select value={quote.sender || ''} onChange={handleSenderSelect}>
                <option value="">Select Sender</option>
                {senderList.map(s => (
                  <option key={s.id} value={s.id}>{s.company_name}</option>
                ))}
              </select>
              <button type="button" onClick={() => setShowSenderForm(true)}>Add New Sender</button>
            </div>
          </div>
        </div>
        <h3 style={{ color: '#1976d2', marginTop: 24 }}>Parts</h3>
        {quote.parts.map((part, idx) => (
          <PartForm
            key={idx}
            part={part}
            onChange={(p) => handlePartChange(idx, p)}
            onRemove={() => handleRemovePart(idx)}
            onFileUpload={handleFileUpload}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
          <button type="button" onClick={handleAddPart} style={{ background: '#43a047', color: '#fff', fontWeight: 600 }}>Add Part</button>
        </div>
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button type="button" style={{ background: '#1976d2', color: '#fff', marginRight: 8 }} onClick={handleSaveQuote}>Save Quote</button>
          <pre style={{ background: '#f4f7fb', borderRadius: 8, padding: 12, marginTop: 16, fontSize: 13, color: '#374151', overflowX: 'auto' }}>{JSON.stringify(quote, null, 2)}</pre>
        </div>
      </div>

      {/* Client Form Modal */}
      {showClientForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Client</h3>
            <form onSubmit={handleAddClient}>
              <div className="form-row">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={newClient.company_name}
                  onChange={e => setNewClient(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <label>Address:</label>
                <input
                  type="text"
                  value={newClient.company_address}
                  onChange={e => setNewClient(prev => ({ ...prev, company_address: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <label>Town:</label>
                <input
                  type="text"
                  value={newClient.town}
                  onChange={e => setNewClient(prev => ({ ...prev, town: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label>Contact Person:</label>
                <input
                  type="text"
                  value={newClient.contact}
                  onChange={e => setNewClient(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  value={newClient.company_email}
                  onChange={e => setNewClient(prev => ({ ...prev, company_email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Add Client</button>
                <button type="button" onClick={() => setShowClientForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sender Form Modal */}
      {showSenderForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Sender</h3>
            <form onSubmit={handleAddSender}>
              <div className="form-row">
                <label>Company Name:</label>
                <input
                  type="text"
                  value={newSender.company_name}
                  onChange={e => setNewSender(prev => ({ ...prev, company_name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <label>Address:</label>
                <input
                  type="text"
                  value={newSender.company_address}
                  onChange={e => setNewSender(prev => ({ ...prev, company_address: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <label>Town:</label>
                <input
                  type="text"
                  value={newSender.town}
                  onChange={e => setNewSender(prev => ({ ...prev, town: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label>Contact Person:</label>
                <input
                  type="text"
                  value={newSender.contact}
                  onChange={e => setNewSender(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
              <div className="form-row">
                <label>Email:</label>
                <input
                  type="email"
                  value={newSender.company_email}
                  onChange={e => setNewSender(prev => ({ ...prev, company_email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Add Sender</button>
                <button type="button" onClick={() => setShowSenderForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [quotes, setQuotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [senders, setSenders] = useState([]);
  const [viewQuoteId, setViewQuoteId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/quotes/')
      .then(res => res.json())
      .then(setQuotes);
    fetch('http://localhost:8000/clients/')
      .then(res => res.json())
      .then(setClients);
    fetch('http://localhost:8000/senders/')
      .then(res => res.json())
      .then(setSenders);
  }, [page]);

  if (viewQuoteId) {
    return <QuoteDetail quoteId={viewQuoteId} onBack={() => { setViewQuoteId(null); setPage('home'); }} />;
  }
  if (page === 'home') {
    return <HomePage quotes={quotes} onNewQuote={() => setPage('new')} clients={clients} onViewQuote={setViewQuoteId} />;
  }
  if (page === 'new') {
    return <QuoteForm clients={clients} senders={senders} onBack={() => setPage('home')} />;
  }
  return null;
}

export default App;
