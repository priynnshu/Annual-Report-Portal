
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Building2 } from "lucide-react";
import "./Departments.css";

const initialDepartments = [
  { id: 1, name: "Computer Science & AI", code: "CSAI", head: "Dr. Sharma", total: 20, submitted: 18 },
  { id: 2, name: "Management", code: "MGT", head: "Dr. Mehta", total: 18, submitted: 14 },
  { id: 3, name: "Design", code: "DSN", head: "Dr. Kapoor", total: 15, submitted: 12 },
  { id: 4, name: "Law", code: "LAW", head: "Dr. Verma", total: 15, submitted: 9 },
];

const emptyForm = { name: "", code: "", head: "", total: 0 };

function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredDepartments = departments.filter((department) =>
    `${department.name} ${department.code} ${department.head}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(department) {
    setEditingId(department.id);
    setForm({
      name: department.name,
      code: department.code,
      head: department.head,
      total: department.total,
    });
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanForm = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      head: form.head.trim(),
      total: Math.max(0, Number(form.total) || 0),
    };

    if (!cleanForm.name || !cleanForm.code || !cleanForm.head) {
      return;
    }

    if (editingId !== null) {
      setDepartments((current) =>
        current.map((department) =>
          department.id === editingId
            ? { ...department, ...cleanForm }
            : department
        )
      );
    } else {
      setDepartments((current) => [
        ...current,
        {
          id: Date.now(),
          ...cleanForm,
          submitted: 0,
        },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteDepartment(id) {
    const department = departments.find((item) => item.id === id);
    if (!department) return;

    const confirmed = window.confirm(
      `Delete the ${department.name} department?`
    );

    if (confirmed) {
      setDepartments((current) =>
        current.filter((item) => item.id !== id)
      );
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
          </div>
        </div>

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
                            style={{ width: `${percentage}%` }}
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
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="department-modal-overlay">
          <div className="department-modal">
            <div className="modal-heading">
              <div>
                <h3>{editingId ? "Edit Department" : "Add Department"}</h3>
                <p>
                  {editingId
                    ? "Update the department details."
                    : "Enter the details of the new department."}
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
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save Changes" : "Add Department"}
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
