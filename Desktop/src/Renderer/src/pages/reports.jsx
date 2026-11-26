
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FileText,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import "./reports.css";

const REPORTS_API = "http://localhost:4000/api/reports";
const DEPARTMENTS_API = "http://localhost:4000/api/departments";

const emptyForm = {
  title: "",
  category: "",
  academicYear: "2025-2026",
  description: "",
  departmentId: "",
};

function Reports() {
  const [reports, setReports] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [reportsResponse, departmentsResponse] = await Promise.all([
        fetch(REPORTS_API),
        fetch(DEPARTMENTS_API),
      ]);

      if (!reportsResponse.ok || !departmentsResponse.ok) {
        throw new Error("Unable to fetch reports or departments.");
      }

      const reportsData = await reportsResponse.json();
      const departmentsData = await departmentsResponse.json();

      setReports(reportsData);
      setDepartments(departmentsData);
    } catch (err) {
      console.error(err);
      setError("Unable to load data. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredReports = reports.filter((report) => {
    const searchText =
      `${report.title} ${report.category} ${report.academicYear} ${report.department?.name || ""}`
        .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(report) {
    if (report.status !== "DRAFT") return;

    setEditingId(report.id);
    setForm({
      title: report.title,
      category: report.category,
      academicYear: report.academicYear,
      description: report.description || "",
      departmentId: report.departmentId,
    });

    setError("");
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        academicYear: form.academicYear.trim(),
        description: form.description.trim(),
        departmentId: form.departmentId,
      };

      if (
        !payload.title ||
        !payload.category ||
        !payload.academicYear ||
        !payload.departmentId
      ) {
        throw new Error("Please complete all required fields.");
      }

      const response = await fetch(
        editingId ? `${REPORTS_API}/${editingId}` : REPORTS_API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save report.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function submitReport(report) {
    const confirmed = window.confirm(
      `Submit "${report.title}" for review?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${REPORTS_API}/${report.id}/submit`,
        { method: "PATCH" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit report.");
      }

      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteReport(report) {
    if (report.status !== "DRAFT") return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${report.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`${REPORTS_API}/${report.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete report.");
      }

      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  }

  const statusClass = (status) =>
    status.toLowerCase().replaceAll("_", "-");

  return (
    <div className="reports-page">
      <div className="reports-heading">
        <div>
          <p className="eyebrow">REPORTING WORKSPACE</p>
          <h2>Annual Reports</h2>
          <p className="welcome-text">
            Create, manage and track annual reports across departments.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          <Plus size={17} />
          Create Report
        </button>
      </div>

      <div className="reports-summary">
        <div className="report-summary-card">
          <FileText size={22} />
          <div>
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="summary-dot draft-dot" />
          <div>
            <span>Draft</span>
            <strong>
              {reports.filter((r) => r.status === "DRAFT").length}
            </strong>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="summary-dot submitted-dot" />
          <div>
            <span>Submitted</span>
            <strong>
              {reports.filter((r) => r.status === "SUBMITTED").length}
            </strong>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="summary-dot approved-dot" />
          <div>
            <span>Approved</span>
            <strong>
              {reports.filter((r) => r.status === "APPROVED").length}
            </strong>
          </div>
        </div>
      </div>

      <section className="panel reports-panel">
        <div className="reports-toolbar">
          <div>
            <h3>All Reports</h3>
            <p>Reports stored in your institute database</p>
          </div>

          <div className="reports-controls">
            <div className="reports-search">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter reports by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              className="refresh-button"
              onClick={fetchData}
              title="Refresh reports"
              aria-label="Refresh reports"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {error && !showForm && (
          <div className="reports-error">{error}</div>
        )}

        {loading ? (
          <div className="reports-loading">
            <Loader2 size={25} className="loading-spinner" />
            <p>Loading reports...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="report-name-cell">
                        <div className="report-file-icon">
                          <FileText size={17} />
                        </div>
                        <span>{report.title}</span>
                      </div>
                    </td>

                    <td>
                      {report.department?.name || "Unknown"}
                    </td>

                    <td>{report.academicYear}</td>
                    <td>{report.category}</td>

                    <td>
                      <span className={`report-status ${statusClass(report.status)}`}>
                        {report.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <div className="report-actions">
                        {report.status === "DRAFT" && (
                          <>
                            <button
                              className="report-action edit-report"
                              title="Edit report"
                              onClick={() => openEditForm(report)}
                            >
                              <Pencil size={15} />
                            </button>

                            <button
                              className="report-action submit-report"
                              title="Submit report"
                              onClick={() => submitReport(report)}
                            >
                              <Send size={15} />
                            </button>

                            <button
                              className="report-action delete-report"
                              title="Delete report"
                              onClick={() => deleteReport(report)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}

                        {report.status !== "DRAFT" && (
                          <span className="locked-report">Locked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-reports">
                      {search || statusFilter !== "ALL"
                        ? "No matching reports found."
                        : "No reports available. Create your first report."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="report-modal-heading">
              <div>
                <h3>{editingId ? "Edit Report" : "Create New Report"}</h3>
                <p>Enter the report details below.</p>
              </div>

              <button
                className="report-modal-close"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div className="reports-error">{error}</div>}

              <label>
                Report Title
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Annual Department Report"
                />
              </label>

              <label>
                Department
                <select
                  required
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Category
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. Department Activities"
                />
              </label>

              <label>
                Academic Year
                <input
                  required
                  value={form.academicYear}
                  onChange={(e) =>
                    setForm({ ...form, academicYear: e.target.value })
                  }
                  placeholder="e.g. 2025-2026"
                />
              </label>

              <label>
                Description
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Enter a brief report description..."
                />
              </label>

              <div className="report-modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  disabled={saving}
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving || departments.length === 0}
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="loading-spinner" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Create Report"
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

export default Reports;
