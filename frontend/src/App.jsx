import { useState, useEffect } from 'react';
import PartForm from './components/PartForm';
import ThemeToggle from './components/ThemeToggle';
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
    <div>
      <div className="header">
        <h1>HMT-EZQ - Ravnsgaard Metal</h1>
        <ThemeToggle />
      </div>
      <div style={{ padding: 24, maxWidth: 900 }}>
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

  if (!quote) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading quote details...</p>
    </div>
  );

  return (
    <div>
      <div className="header">
        <h1>HMT-EZQ - Ravnsgaard Metal</h1>
        <ThemeToggle />
      </div>
      <div style={{ padding: '0 1.5rem' }}>
        <button 
          onClick={onBack} 
          className="back-button"
        >
          ← Back to Quotes
        </button>

        <div className="quote-info">
          <div className="quote-header">
            <h2>Quote #{quote.quote_number}</h2>
            <div className="quote-date">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 1V3M11.5 1V3M2 5.5H14M14 5.5V12.5C14 13.0523 13.5523 13.5 13 13.5H3C2.44772 13.5 2 13.0523 2 12.5V5.5M14 5.5V3.5C14 2.94772 13.5523 2.5 13 2.5H3C2.44772 2.5 2 2.94772 2 3.5V5.5" 
                  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {new Date(quote.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>

          <div className="quote-details-grid">
            <div className="detail-card">
              <h3>Client</h3>
              <p className="company-name">{quote.client}</p>
              <div className="company-details">
                <p>Contact: {quote.client_contact || 'N/A'}</p>
                <p>Location: {quote.client_town || 'N/A'}</p>
              </div>
            </div>
            <div className="detail-card">
              <h3>Sender</h3>
              <p className="company-name">{quote.sender}</p>
              <div className="company-details">
                <p>Contact: {quote.sender_contact || 'N/A'}</p>
                <p>Location: {quote.sender_town || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="parts-section">
          <h2>Parts</h2>
          <div className="parts-grid">
            {quote.parts.map((part, idx) => (
              <div key={idx} className="part-detail-card">
                <div className="part-header">
                  <div>
                    <h3>{part.part_name}</h3>
                    <p className="part-number">#{part.part_number}</p>
                  </div>
                  <div className="part-quantity">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                      <path d="M6.5 13.5H4.5C3.94772 13.5 3.5 13.0523 3.5 12.5V10.5M3.5 10.5V8.5M3.5 10.5H5.5M9.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V10.5M12.5 10.5V8.5M12.5 10.5H10.5M9.5 2.5H11.5C12.0523 2.5 12.5 2.94772 12.5 3.5V5.5M12.5 5.5V7.5M12.5 5.5H10.5M6.5 2.5H4.5C3.94772 2.5 3.5 2.94772 3.5 3.5V5.5M3.5 5.5V7.5M3.5 5.5H5.5" 
                        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {part.quantity}
                  </div>
                </div>

                <div className="part-info">
                  {part.description && (
                    <p className="part-description">{part.description}</p>
                  )}
                  <p className="material-cost">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5C2.5 3.11929 3.61929 2 5 2H11C12.3807 2 13.5 3.11929 13.5 4.5V11.5C13.5 12.8807 12.3807 14 11 14H5C3.61929 14 2.5 12.8807 2.5 11.5V4.5Z" 
                        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 5C8.5 4.72386 8.27614 4.5 8 4.5C7.72386 4.5 7.5 4.72386 7.5 5V6.5H6C5.72386 6.5 5.5 6.72386 5.5 7C5.5 7.27614 5.72386 7.5 6 7.5H7.5V9C7.5 9.27614 7.72386 9.5 8 9.5C8.27614 9.5 8.5 9.27614 8.5 9V7.5H10C10.2761 7.5 10.5 7.27614 10.5 7C10.5 6.72386 10.2761 6.5 10 6.5H8.5V5Z" 
                        fill="currentColor"/>
                      <path d="M6.5 11C6.5 11.2761 6.72386 11.5 7 11.5H9C9.27614 11.5 9.5 11.2761 9.5 11C9.5 10.7239 9.27614 10.5 9 10.5H7C6.72386 10.5 6.5 10.7239 6.5 11Z" 
                        fill="currentColor"/>
                    </svg>
                    Material Cost: {Number(part.material_cost).toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}
                  </p>
                </div>

                <div className="file-links">
                  {part.pdf_file && (
                    <a href={part.pdf_file} target="_blank" rel="noopener noreferrer" className="file-link">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 7.5V11.5C13 12.0523 12.5523 12.5 12 12.5H4C3.44772 12.5 3 12.0523 3 11.5V4.5C3 3.94772 3.44772 3.5 4 3.5H9M13 7.5L9 3.5M13 7.5H9.5C9.22386 7.5 9 7.27614 9 7V3.5" 
                          stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      PDF Drawing
                    </a>
                  )}
                  {part.step_file && (
                    <a href={part.step_file} target="_blank" rel="noopener noreferrer" className="file-link">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 3.5H4.5C3.94772 3.5 3.5 3.94772 3.5 4.5V11.5C3.5 12.0523 3.94772 12.5 4.5 12.5H11.5C12.0523 12.5 12.5 12.0523 12.5 11.5V8.5M12.5 3.5L8.5 7.5M12.5 3.5H9.5M12.5 3.5V6.5" 
                          stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      STEP Model
                    </a>
                  )}
                </div>

                <div className="operations-section">
                  <h4>Operations</h4>
                  <div className="operations-list">
                    {part.operations.map((op, opIdx) => (
                      <div key={opIdx} className="operation-detail-card">
                        <div className="operation-header">
                          <h5>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                              <path d="M2.5 8C2.5 5.23858 4.73858 3 7.5 3C10.2614 3 12.5 5.23858 12.5 8C12.5 10.7614 10.2614 13 7.5 13C4.73858 13 2.5 10.7614 2.5 8Z" 
                                stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7.5 5.5V8L9 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {op.process}
                          </h5>
                        </div>
                        <div className="operation-times">
                          <div className="time-item">
                            <label>Setup</label>
                            <span>{op.setup_time} min</span>
                          </div>
                          <div className="time-item">
                            <label>Programming</label>
                            <span>{op.programming_time} min</span>
                          </div>
                          <div className="time-item">
                            <label>First Part</label>
                            <span>{op.first_part_time} min</span>
                          </div>
                          <div className="time-item">
                            <label>Part Production</label>
                            <span>{op.part_time} min</span>
                          </div>
                          {op.external_days > 0 && (
                            <div className="time-item">
                              <label>External Days</label>
                              <span>{op.external_days} days</span>
                            </div>
                          )}
                          {op.external_cost > 0 && (
                            <div className="time-item">
                              <label>External Cost</label>
                              <span>{Number(op.external_cost).toLocaleString('da-DK', { style: 'currency', currency: 'DKK' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    <div>
      <div className="header">
        <h1>HMT-EZQ - Ravnsgaard Metal</h1>
        <ThemeToggle />
      </div>
      <div style={{ padding: '0 1.5rem' }}>
        <button onClick={onBack} style={{ marginBottom: 16, background: '#f44336', color: '#fff' }}>Back</button>
        <div className="quote-info">
          <h2>New Quote</h2>
          <div className="quote-grid">
            <div>
              <label>Quote Number</label>
              <input 
                name="quote_number" 
                value={quote.quote_number} 
                readOnly 
                style={{ width: '100%' }} 
              />
            </div>
            <div>
              <label>Client</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={quote.client || ''} onChange={handleClientSelect} style={{ flex: 1 }}>
                  <option value="">Select Client</option>
                  {clientList.map(c => (
                    <option key={c.id} value={c.id}>{c.company_name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowClientForm(true)}>+</button>
              </div>
            </div>
            <div>
              <label>Sender</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={quote.sender || ''} onChange={handleSenderSelect} style={{ flex: 1 }}>
                  <option value="">Select Sender</option>
                  {senderList.map(s => (
                    <option key={s.id} value={s.id}>{s.company_name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setShowSenderForm(true)}>+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="parts-section">
          <h2>Parts</h2>
          <div className="parts-grid">
            {quote.parts.map((part, idx) => (
              <PartForm
                key={idx}
                part={part}
                onChange={(p) => handlePartChange(idx, p)}
                onRemove={() => handleRemovePart(idx)}
                onFileUpload={handleFileUpload}
              />
            ))}
          </div>
          <button 
            type="button" 
            onClick={handleAddPart}
            className="add-part-button"
          >
            + Add Part
          </button>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              type="button" 
              style={{ background: '#1976d2', color: '#fff', padding: '0.75rem 2rem' }} 
              onClick={handleSaveQuote}
            >
              Save Quote
            </button>
          </div>
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
