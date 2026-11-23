
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Building2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import "./Departments.css";

const API_URL = "http://localhost:4000/api/departments";

const emptyForm = {
  name: "",
  code: "",
  head: "",
  total: 0,
};

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch departments from PostgreSQL through Express
  async function fetchDepartments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch departments.");
      }

      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load departments. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Search departments
  const filteredDepartments = departments.filter((department) =>
    `${department.name} ${department.code} ${department.head}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Open add form
  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  // Open edit form
  function openEditForm(department) {
    setEditingId(department.id);

    setForm({
      name: department.name,
      code: department.code,
      head: department.head,
      total: department.total,
    });

    setShowForm(true);
    setError("");
  }

  // Add or update department
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        head: form.head.trim(),
        total: Number(form.total),
      };

      if (
        !payload.name ||
        !payload.code ||
        !payload.head ||
        !Number.isInteger(payload.total) ||
        payload.total < 0
      ) {
        throw new Error("Please enter valid department details.");
      }

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save department.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await fetchDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Delete department
  async function deleteDepartment(id) {
    const department = departments.find((item) => item.id === id);

    if (!department) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete department.");
      }

      await fetchDepartments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="departments-page">
      <div className="departments-heading">
        <div>
          <p className="eyebrow">ORGANIZATION</p>
          <h2>Departments</h2>
          <p className="welcome-text">
            Manage departments and track their annual report submissions.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} />
          Add Department
        </button>
      </div>

      <div className="department-summary">
        <div className="department-summary-icon">
          <Building2 size={22} />
        </div>

        <div>
          <span>Total Departments</span>
          <strong>{departments.length}</strong>
        </div>
      </div>

      <section className="panel departments-table-panel">
        <div className="departments-toolbar">
          <div>
            <h3>All Departments</h3>
            <p>Department directory and reporting progress</p>
          </div>

          <div className="department-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search departments..."
            />

            <button
              className="refresh-button"
              onClick={fetchDepartments}
              title="Refresh departments"
              aria-label="Refresh departments"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {error && !showForm && (
          <div className="department-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="department-loading">
            <Loader2 className="loading-spinner" size={24} />
            <p>Loading departments...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Code</th>
                  <th>Department Head</th>
                  <th>Reports</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => {
                  const percentage =
                    department.total > 0
                      ? Math.round(
                          (department.submitted / department.total) * 100
                        )
                      : 0;

                  return (
                    <tr key={department.id}>
                      <td className="department-name-cell">
                        <div className="department-table-icon">
                          <Building2 size={17} />
                        </div>
                        {department.name}
                      </td>

                      <td>{department.code}</td>
                      <td>{department.head}</td>

                      <td>
                        {department.submitted}/{department.total}
                      </td>

                      <td>
                        <div className="department-progress-cell">
                          <div className="progress-track">
                            <div
                              className="progress-fill blue"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                              }}
                            />
                          </div>

                          <span>{percentage}%</span>
                        </div>
                      </td>

                      <td>
                        <div className="department-actions">
                          <button
                            className="action-button edit-action"
                            title="Edit department"
                            onClick={() => openEditForm(department)}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            className="action-button delete-action"
                            title="Delete department"
                            onClick={() => deleteDepartment(department.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredDepartments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-departments">
                      {search
                        ? "No matching departments found."
                        : "No departments available. Add your first department."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="department-modal-overlay">
          <div className="department-modal">
            <div className="modal-heading">
              <div>
                <h3>
                  {editingId ? "Edit Department" : "Add Department"}
                </h3>

                <p>
                  Enter the department information below.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="department-error">
                  {error}
                </div>
              )}

              <label>
                Department Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Computer Science & AI"
                />
              </label>

              <label>
                Department Code
                <input
                  required
                  value={form.code}
                  onChange={(event) =>
                    setForm({ ...form, code: event.target.value })
                  }
                  placeholder="e.g. CSAI"
                />
              </label>

              <label>
                Department Head
                <input
                  required
                  value={form.head}
                  onChange={(event) =>
                    setForm({ ...form, head: event.target.value })
                  }
                  placeholder="e.g. Dr. Sharma"
                />
              </label>

              <label>
                Total Reports Expected
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.total}
                  onChange={(event) =>
                    setForm({ ...form, total: event.target.value })
                  }
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="loading-spinner" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Add Department"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
