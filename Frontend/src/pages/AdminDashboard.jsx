import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintTable from "../components/ComplaintTable.jsx";
import DashboardStat from "../components/DashboardStat.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { TableSkeleton, StatSkeleton } from "../components/Skeleton.jsx";
import { complaintService } from "../services/api.js";

const statusFilters = ["all", "Pending", "Assigned", "In Progress", "Resolved", "Rejected"];
const categories = ["all", "Plumbing", "Electricity", "Cleaning", "Furniture", "Other"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async (page = 1) => {
    setLoading(true);

    try {
      const [complaintsResponse, statsResponse] = await Promise.all([
        complaintService.getAllComplaints({
          page,
          limit: 10,
          ...(statusFilter !== "all" ? { status: statusFilter } : {}),
          ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
          ...(query ? { search: query } : {}),
        }),
        complaintService.getStats(),
      ]);

      setComplaints(complaintsResponse.data.complaints || []);
      setPagination(
        complaintsResponse.data.pagination || {
          page: 1,
          pages: 1,
          total: complaintsResponse.data.complaints?.length || 0,
        },
      );
      setStats(statsResponse.data || null);
      setError("");
    } catch (loadError) {
      setComplaints([]);
      setError(loadError.response?.data?.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadDashboard(1);
  }, [statusFilter, categoryFilter, query]);

  const statCards = stats
    ? [
        { label: "Total complaints", value: stats.total, tone: "Across the system" },
        { label: "Pending", value: stats.pending, tone: "Awaiting action" },
        { label: "In progress", value: stats.inProgress, tone: "Currently active" },
        { label: "Resolved", value: stats.resolved, tone: "Closed successfully" },
      ]
    : [];

  return (
    <div className="page-fade space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-ink">Complaint queue</h1>
          <p className="mt-2 text-sm text-muted">
            Review, filter, and manage complaints from students.
          </p>
        </div>

        <button type="button" onClick={() => loadDashboard(pagination.page)} className="button-secondary">
          Refresh
        </button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading && !stats
          ? Array.from({ length: 4 }).map((_, index) => (
              <StatSkeleton key={index} />
            ))
          : statCards.map((card) => (
              <DashboardStat
                key={card.label}
                label={card.label}
                value={card.value}
                tone={card.tone}
              />
            ))}
      </section>

      <section className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input-base"
            placeholder="Search by title or student name"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="input-base"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatusFilter(item)}
              className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                statusFilter === item
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-canvas text-body hover:bg-section hover:text-ink"
              }`}
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-xs text-danger">
            {error}
          </div>
        ) : null}

        {loading ? (
          <TableSkeleton rows={8} showReporter />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No complaints found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <ComplaintTable
            complaints={complaints}
            showReporter
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => loadDashboard(page)}
            onViewComplaint={(complaint) => navigate(`/complaints/${complaint._id}`)}
          />
        )}
      </section>
    </div>
  );
}
