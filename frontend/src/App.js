import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "Call",
  });

  // Fetch leads
  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Add lead
  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("All fields required");
      return;
    }

    await axios.post("http://localhost:5000/leads", form);
    setForm({ name: "", phone: "", source: "Call" });
    fetchLeads();
  };

  // Update status
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/leads/${id}`, { status });
    fetchLeads();
  };

  // Delete lead
  const deleteLead = async (id) => {
    await axios.delete(`http://localhost:5000/leads/${id}`);
    fetchLeads();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Lead Management System 🚀</h2>

      {/* Form */}
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <select
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
      >
        <option>Call</option>
        <option>WhatsApp</option>
        <option>Field</option>
      </select>

      <button onClick={handleSubmit}>Add Lead</button>

      <hr />

      {/* Leads List */}
      {leads.map((lead) => (
        <div key={lead.id} style={{ marginBottom: 10 }}>
          <b>{lead.name}</b> | {lead.phone} | {lead.source}

          <select
            value={lead.status}
            onChange={(e) => updateStatus(lead.id, e.target.value)}
          >
            <option>Interested</option>
            <option>Not Interested</option>
            <option>Converted</option>
          </select>

          <button onClick={() => deleteLead(lead.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;