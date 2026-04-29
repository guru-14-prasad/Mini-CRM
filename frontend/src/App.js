import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./App.css";

const LeadCard = React.memo(({ lead, onUpdateStatus, onDelete }) => {
  const handleStatusChange = useCallback((e) => {
    onUpdateStatus(lead.id, e.target.value);
  }, [lead.id, onUpdateStatus]);

  const handleDelete = useCallback(() => {
    onDelete(lead.id);
  }, [lead.id, onDelete]);

  return (
    <div className="card">
      <b>{lead.name}</b> | {lead.phone} | {lead.source}
      <select
        className="input"
        value={lead.status}
        onChange={handleStatusChange}
      >
        <option>Interested</option>
        <option>Not Interested</option>
        <option>Converted</option>
      </select>
      <button className="delete" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
});

const LeadForm = React.memo(({ form, setForm, onSubmit }) => {
  const handleChange = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, [setForm]);

  return (
    <div className="form">
      <input
        className="input"
        placeholder="Name"
        value={form.name}
        onChange={handleChange('name')}
      />
      <input
        className="input"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange('phone')}
      />
      <select
        className="input"
        value={form.source}
        onChange={handleChange('source')}
      >
        <option>Call</option>
        <option>WhatsApp</option>
        <option>Field</option>
      </select>
      <button className="btn" onClick={onSubmit}>
        Add Lead
      </button>
    </div>
  );
});

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/leads");
      setLeads(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.phone) {
      alert("All fields required");
      return;
    }
    try {
      await axios.post("http://localhost:5000/leads", form);
      setForm({ name: "", phone: "", source: "Call" });
      fetchLeads();
    } catch (err) {
      alert("Failed to add lead");
    }
  }, [form, fetchLeads]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/leads/${id}`, { status });
      fetchLeads();
    } catch (err) {
      alert("Failed to update status");
    }
  }, [fetchLeads]);

  const deleteLead = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/leads/${id}`);
      fetchLeads();
    } catch (err) {
      alert("Failed to delete lead");
    }
  }, [fetchLeads]);

  const filtered = useMemo(() =>
    leads.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
    ), [leads, search]
  );

  const total = leads.length;
  const converted = useMemo(() =>
    leads.filter(l => l.status === "Converted").length,
    [leads]
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="animated-title">Lead Management System</h1>

      {/* Dashboard */}
      <div className="dashboard">
        <div>Total Leads: {total}</div>
        <div>Converted: {converted}</div>
      </div>

      {/* Search */}
      <input
        className="input"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Form */}
      <LeadForm form={form} setForm={setForm} onSubmit={handleSubmit} />

      {/* Leads */}
      <div className="list">
        {filtered.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onUpdateStatus={updateStatus}
            onDelete={deleteLead}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(App);