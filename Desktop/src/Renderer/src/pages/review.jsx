
import { useEffect, useState } from "react";
import {
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Eye,
} from "lucide-react";
import "./review.css";

const API_URL = "http://localhost:4000/api/reports";

function Review() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function fetchReports() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) throw new Error("Unable to fetch reports.");

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function updateStatus(report, action, payload = {}) {
    try {
      setBusyId(report.id);
      setError("");

      const response = await fetch(
        `${API_URL}/${report.id}/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update report.");
      }

      setSelectedReport(null);
      setRejectionReason("");
      await fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const pendingReports = reports.filter(
    (report) =>
      report.status === "SUBMITTED" ||
      report.status === "UNDER_REVIEW"
  );

  const approvedCount = reports.filter(
    (report) => report.status === "APPROVED"
  ).length;

  const rejectedCount = reports.filter(
    (report) => report.status === "REJECTED"
  ).length;

  return (
    <div className="review-page">
      <div className="review-heading">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h2>Review & Approval</h2>
          <p className="welcome-text">
            Review department submissions and manage approvals.
          </p>
        </div>

        <button className="primary-button" onClick={fetchReports}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="review-stats">
        <div className="review-stat">
          <ClipboardCheck size={21} />
          <div>
            <span>Awaiting Review</span>
            <strong>{pendingReports.length}</strong>
          </div>
        </div>

        <div className="review-stat">
          <CheckCircle2 size={21} />
          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="review-stat">
          <XCircle size={21} />
          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>
      </div>

      <section className="panel review-panel">
        <div className="review-panel-heading">
          <div>
            <h3>Reports Requiring Attention</h3>
            <p>Submitted reports and reports currently under review</p>
          </div>
        </div>

        {error && <div className="review-error">{error}</div>}

        {loading ? (
          <div className="review-loading">
            <Loader2 size={24} className="loading-spinner" />
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {pendingReports.map((report) => (
                  <tr key={report.id}>
                    <td className="review-report-title">
                      {report.title}
                    </td>

                    <td>{report.department?.name || "Unknown"}</td>
                    <td>{report.academicYear}</td>

                    <td>
                      <span
                        className={`review-status ${report.status.toLowerCase().replaceAll("_", "-")}`}
                      >
                        {report.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <div className="review-actions">
                        <button
                          className="review-action view"
                          title="View report"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye size={16} />
                        </button>

                        {report.status === "SUBMITTED" && (
                          <button
                            className="review-action start"
                            disabled={busyId === report.id}
                            onClick={() =>
                              updateStatus(report, "review")
                            }
                          >
                            Start Review
                          </button>
                        )}

                        {report.status === "UNDER_REVIEW" && (
                          <>
                            <button
                              className="review-action approve"
                              disabled={busyId === report.id}
                              onClick={() => {
                                if (window.confirm("Approve this report?")) {
                                  updateStatus(report, "approve");
                                }
                              }}
                            >
                              Approve
                            </button>

                            <button
                              className="review-action reject"
                              disabled={busyId === report.id}
                              onClick={() => {
                                setSelectedReport(report);
                                setRejectionReason("");
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {pendingReports.length === 0 && (
                  <tr>
                    <td colSpan="5" className="review-empty">
                      No reports are currently awaiting review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedReport && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <div className="review-modal-heading">
              <div>
                <h3>Report Details</h3>
                <p>Review the submitted information.</p>
              </div>

              <button
                className="review-close"
                onClick={() => {
                  setSelectedReport(null);
                  setRejectionReason("");
                }}
              >
                ×
              </button>
            </div>

            <div className="review-details">
              <p><strong>Title:</strong> {selectedReport.title}</p>
              <p><strong>Department:</strong> {selectedReport.department?.name}</p>
              <p><strong>Category:</strong> {selectedReport.category}</p>
              <p><strong>Academic Year:</strong> {selectedReport.academicYear}</p>
              <p><strong>Status:</strong> {selectedReport.status.replaceAll("_", " ")}</p>
              <p><strong>Description:</strong> {selectedReport.description || "No description provided."}</p>
            </div>

            {selectedReport.status === "UNDER_REVIEW" && (
              <>
                <label className="rejection-label">
                  Rejection reason (only required when rejecting)
                  <textarea
                    rows="3"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this report needs correction..."
                  />
                </label>

                <div className="review-modal-actions">
                  <button
                    className="review-action reject"
                    disabled={!rejectionReason.trim() || busyId === selectedReport.id}
                    onClick={() =>
                      updateStatus(selectedReport, "reject", {
                        reason: rejectionReason,
                      })
                    }
                  >
                    Reject Report
                  </button>

                  <button
                    className="review-action approve"
                    disabled={busyId === selectedReport.id}
                    onClick={() => {
                      if (window.confirm("Approve this report?")) {
                        updateStatus(selectedReport, "approve");
                      }
                    }}
                  >
                    Approve Report
                  </button>
                </div>
              </>
            )}

            {selectedReport.status === "SUBMITTED" && (
              <button
                className="review-action start"
                disabled={busyId === selectedReport.id}
                onClick={() => updateStatus(selectedReport, "review")}
              >
                Start Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Review;

