import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("All fields required");
      return;
    }
    await axios.post("http://localhost:5000/leads", form);
    setForm({ name: "", phone: "", source: "Call" });
    fetchLeads();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/leads/${id}`, { status });
    fetchLeads();
  };

  const deleteLead = async (id) => {
    await axios.delete(`http://localhost:5000/leads/${id}`);
    fetchLeads();
  };

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = leads.length;
  const converted = leads.filter(l => l.status === "Converted").length;

  return (
    <div className="container">
      <h1>🚀 Lead Management System</h1>

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
      <div className="form">
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <select
          className="input"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        >
          <option>Call</option>
          <option>WhatsApp</option>
          <option>Field</option>
        </select>

        <button className="btn" onClick={handleSubmit}>
          Add Lead
        </button>
      </div>

      {/* Leads */}
      <div className="list">
        {filtered.map((lead) => (
          <div key={lead.id} className="card">
            <b>{lead.name}</b> | {lead.phone} | {lead.source}

            <select
              className="input"
              value={lead.status}
              onChange={(e) => updateStatus(lead.id, e.target.value)}
            >
              <option>Interested</option>
              <option>Not Interested</option>
              <option>Converted</option>
            </select>

            <button className="delete" onClick={() => deleteLead(lead.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;