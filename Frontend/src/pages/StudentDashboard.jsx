import { ClipboardList, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintTable from "../components/ComplaintTable.jsx";
import DashboardStat from "../components/DashboardStat.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { TableSkeleton, StatSkeleton } from "../components/Skeleton.jsx";
import { complaintService } from "../services/api.js";

const filters = ["all", "Pending", "Assigned", "In Progress", "Resolved", "Rejected"];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async (page = 1, activeFilter = filter) => {
    setLoading(true);

    try {
      const [complaintsResponse, statsResponse] = await Promise.all([
        complaintService.getMyComplaints({
          page,
          limit: 8,
          ...(activeFilter !== "all" ? { status: activeFilter } : {}),
        }),
        complaintService.getStats({ userId: "me" }),
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
    loadDashboard(1, filter);
  }, [filter]);

  const statCards = stats
    ? [
        { label: "Total complaints", value: stats.total, tone: "All submissions" },
        { label: "Pending", value: stats.pending, tone: "Waiting for review" },
        { label: "In progress", value: stats.inProgress, tone: "Being handled" },
        { label: "Resolved", value: stats.resolved, tone: "Completed issues" },
      ]
    : [];

  return (
    <div className="page-fade space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-ink">My complaints</h1>
          <p className="mt-2 text-sm text-muted">
            Track your recent submissions and check their current status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/submit-complaint")}
          className="button-primary"
        >
          <Plus size={16} strokeWidth={1.8} className="mr-2" />
          New complaint
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
        {error ? (
          <div className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-xs text-danger">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-sm border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                filter === item
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-canvas text-body hover:bg-section hover:text-ink"
              }`}
            >
              {item === "all" ? "All" : item}
            </button>
          ))}
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No complaints yet"
            description="When you submit a complaint, it will appear here."
            action={
              <button
                type="button"
                onClick={() => navigate("/submit-complaint")}
                className="button-primary"
              >
                Submit complaint
              </button>
            }
          />
        ) : (
          <ComplaintTable
            complaints={complaints}
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
