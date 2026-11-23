
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  FileText,
  ClipboardCheck,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import Departments from "./pages/departments";
import "./App.css";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Departments", icon: Building2 },
  { name: "Annual Reports", icon: FileText },
  { name: "Review & Approval", icon: ClipboardCheck },
  { name: "Report Builder", icon: BarChart3 },
];

const departments = [
  { name: "Computer Science & AI", submitted: 18, total: 20, color: "blue" },
  { name: "Management", submitted: 14, total: 18, color: "purple" },
  { name: "Design", submitted: 12, total: 15, color: "orange" },
  { name: "Law", submitted: 9, total: 15, color: "green" },
];

const submissions = [
  {
    department: "Computer Science & AI",
    title: "Annual Department Report 2025–26",
    date: "Today, 10:30 AM",
    status: "Submitted",
  },
  {
    department: "Management",
    title: "Faculty Development Report",
    date: "Yesterday, 3:45 PM",
    status: "Under Review",
  },
  {
    department: "Design",
    title: "Student Activities Report",
    date: "20 Nov 2026",
    status: "Approved",
  },
  {
    department: "Law",
    title: "Research & Publications Report",
    date: "19 Nov 2026",
    status: "Submitted",
  },
];

const approvals = [
  {
    department: "Management",
    title: "Faculty Development Report",
    submitted: "21 Nov 2026",
  },
  {
    department: "Law",
    title: "Research & Publications Report",
    submitted: "19 Nov 2026",
  },
  {
    department: "Design",
    title: "Department Activities Report",
    submitted: "18 Nov 2026",
  },
];

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [backendMessage, setBackendMessage] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Backend health check
  useEffect(() => {
    let mounted = true;

    async function checkBackend() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/health"
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        if (mounted) {
          setStatus("Connected");
          setBackendMessage(data.message);
        }
      } catch (error) {
        if (mounted) {
          setStatus("Disconnected");
          setBackendMessage("Unable to connect to the backend.");
        }

        console.error("Backend connection error:", error);
      }
    }

    checkBackend();

    const interval = setInterval(checkBackend, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const stats = [
    {
      label: "Total Departments",
      value: "12",
      note: "Registered departments",
      icon: Building2,
      color: "blue",
    },
    {
      label: "Reports Submitted",
      value: "53",
      note: "Across all departments",
      icon: FileText,
      color: "purple",
    },
    {
      label: "Pending Reviews",
      value: "08",
      note: "Awaiting approval",
      icon: Clock3,
      color: "orange",
    },
    {
      label: "Reports Approved",
      value: "45",
      note: "Successfully reviewed",
      icon: CheckCircle2,
      color: "green",
    },
  ];

  // Page rendering
  function renderPage() {
    // Departments page
    if (activePage === "Departments") {
      return <Departments />;
    }

    // Other pages are placeholders for now
    if (activePage !== "Dashboard") {
      const currentPage = navigation.find(
        (item) => item.name === activePage
      );

      const Icon = currentPage?.icon || Settings;

      return (
        <section className="placeholder-page">
          <div className="placeholder-icon">
            <Icon size={28} />
          </div>

          <h2>{activePage}</h2>

          <p>
            This section is ready for development. We'll build it next.
          </p>

          <button
            className="primary-button"
            onClick={() => setActivePage("Dashboard")}
          >
            Back to Dashboard
          </button>
        </section>
      );
    }

    // Dashboard page
    return (
      <>
        <div className="welcome-row">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2>Dashboard</h2>

            <p className="welcome-text">
              Here's what's happening across your institution.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setActivePage("Annual Reports")}
          >
            <Plus size={17} />
            Create Report
          </button>
        </div>

        {/* Statistics */}
        <section className="stats-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={21} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="muted-icon"
                  />
                </div>

                <p className="stat-label">{stat.label}</p>
                <h3>{stat.value}</h3>
                <p className="stat-note">{stat.note}</p>
              </article>
            );
          })}
        </section>

        {/* Department Progress and Approvals */}
        <section className="content-grid">
          <article className="panel department-panel">
            <div className="panel-heading">
              <div>
                <h3>Department Progress</h3>
                <p>Annual report submission overview</p>
              </div>

              <button
                className="text-button"
                onClick={() => setActivePage("Departments")}
              >
                View all
              </button>
            </div>

            <div className="department-list">
              {departments.map((department) => {
                const percentage = Math.round(
                  (department.submitted / department.total) * 100
                );

                return (
                  <div
                    className="department-item"
                    key={department.name}
                  >
                    <div className="department-info">
                      <span>{department.name}</span>

                      <span className="department-count">
                        {department.submitted}/{department.total}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill ${department.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="progress-caption">
                      {percentage}% completed
                    </p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="panel approval-panel">
            <div className="panel-heading">
              <div>
                <h3>Pending Approvals</h3>
                <p>Reports requiring your attention</p>
              </div>

              <span className="count-badge">
                {approvals.length}
              </span>
            </div>

            <div className="approval-list">
              {approvals.map((item) => (
                <div
                  className="approval-item"
                  key={item.title}
                >
                  <div className="approval-icon">
                    <Clock3 size={18} />
                  </div>

                  <div className="approval-details">
                    <strong>{item.title}</strong>

                    <span>
                      {item.department} · {item.submitted}
                    </span>
                  </div>

                  <button
                    className="review-button"
                    onClick={() =>
                      setActivePage("Review & Approval")
                    }
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Recent Submissions */}
        <section className="panel submissions-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Submissions</h3>
              <p>Latest reports submitted by departments</p>
            </div>

            <button
              className="text-button"
              onClick={() => setActivePage("Annual Reports")}
            >
              View all reports
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Report Title</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((item) => (
                  <tr key={item.title}>
                    <td>{item.department}</td>

                    <td className="report-title">
                      {item.title}
                    </td>

                    <td>{item.date}</td>

                    <td>
                      <span
                        className={`status-pill ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">AR</div>

          <div>
            <h1>Annual Reports</h1>
            <span>PORTAL</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-section-label">
          WORKSPACE
        </div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />

                <span>{item.name}</span>

                {item.name === "Review & Approval" && (
                  <span className="nav-count">
                    {approvals.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar bottom */}
        <div className="sidebar-bottom">
          <div className="nav-section-label">
            PREFERENCES
          </div>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => {
              setActivePage("Settings");
              setSidebarOpen(false);
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          {/* Backend status */}
          <div className="backend-card">
            <div className="backend-card-top">
              <span
                className={`connection-dot ${
                  status === "Connected" ? "online" : "offline"
                }`}
              />

              <strong>Backend {status}</strong>
            </div>

            <p>{backendMessage}</p>
          </div>

          {/* User profile */}
          <div className="user-profile">
            <div className="avatar">AD</div>

            <div className="user-info">
              <strong>Administrator</strong>
              <span>Super Admin</span>
            </div>

            <Settings
              size={17}
              className="profile-settings"
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            Institute <span>/</span> {activePage}
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />

              <input placeholder="Search anything..." />

              <kbd>⌘ K</kbd>
            </div>

            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>

            <div className="topbar-user">
              <div className="avatar small-avatar">
                AD
              </div>

              <span className="chevron-down">⌄</span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}

          <footer className="footer">
            Annual Report Portal · Institute-wide Reporting System
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
