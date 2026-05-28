import {
  ArrowLeft,
  FileText,
  LoaderCircle,
  Paperclip,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "../components/ComplaintBadges.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonBlock } from "../components/Skeleton.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { complaintService } from "../services/api.js";
import { formatDateTime } from "../utils/helpers.js";

const buildTimeline = (complaint) => {
  const items = [
    {
      title: "Complaint submitted",
      description: `${complaint.createdBy?.name || "Student"} created this complaint.`,
      timestamp: complaint.createdAt,
    },
  ];

  if (complaint.assignedTo) {
    items.push({
      title: "Complaint assigned",
      description: `Assigned to ${complaint.assignedTo.name}.`,
      timestamp: complaint.updatedAt || complaint.createdAt,
    });
  }

  if (complaint.adminRemarks) {
    items.push({
      title: "Admin note added",
      description: complaint.adminRemarks,
      timestamp: complaint.updatedAt || complaint.createdAt,
    });
  }

  if (complaint.rejectionReason) {
    items.push({
      title: "Complaint rejected",
      description: complaint.rejectionReason,
      timestamp: complaint.updatedAt || complaint.createdAt,
    });
  }

  if (complaint.resolvedAt) {
    items.push({
      title: "Complaint resolved",
      description: "This complaint was marked as resolved.",
      timestamp: complaint.resolvedAt,
    });
  }

  return items;
};

function DetailSkeleton() {
  return (
    <div className="page-fade space-y-6">
      <SkeletonBlock className="h-5 w-28" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <div className="card p-6">
            <SkeletonBlock className="h-7 w-56" />
            <div className="mt-4 flex gap-2">
              <SkeletonBlock className="h-6 w-20" />
              <SkeletonBlock className="h-6 w-16" />
              <SkeletonBlock className="h-6 w-24" />
            </div>
            <SkeletonBlock className="mt-6 h-4 w-full" />
            <SkeletonBlock className="mt-3 h-4 w-11/12" />
            <SkeletonBlock className="mt-3 h-4 w-10/12" />
          </div>
          <div className="card p-6">
            <SkeletonBlock className="h-5 w-40" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <SkeletonBlock className="mt-1 h-3 w-3 rounded-full" />
                  <div className="flex-1">
                    <SkeletonBlock className="h-4 w-40" />
                    <SkeletonBlock className="mt-2 h-3 w-11/12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card h-fit p-6">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="mt-5 h-4 w-full" />
          <SkeletonBlock className="mt-3 h-4 w-2/3" />
          <SkeletonBlock className="mt-6 h-9 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    status: "",
    notes: "",
  });

  const canManage =
    user?.role === "admin" ||
    user?.role === "warden" ||
    user?.role === "maintenance";

  const fetchComplaint = async () => {
    try {
      const response = await complaintService.getComplaintById(id);
      const fetchedComplaint = response.data;

      setComplaint(fetchedComplaint);
      setForm({
        status: fetchedComplaint.status,
        notes:
          fetchedComplaint.status === "Rejected"
            ? fetchedComplaint.rejectionReason || ""
            : fetchedComplaint.adminRemarks || "",
      });
      setError("");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Unable to load complaint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        status: form.status,
      };

      if (form.notes.trim()) {
        if (form.status === "Rejected") {
          payload.rejectionReason = form.notes.trim();
          payload.adminRemarks = form.notes.trim();
        } else {
          payload.adminRemarks = form.notes.trim();
        }
      }

      await complaintService.updateComplaint(id, payload);
      await fetchComplaint();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Unable to update complaint.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!complaint) {
    return (
      <div className="page-fade">
        <EmptyState
          icon={FileText}
          title="Complaint not found"
          description={error || "We couldn't find the complaint you were looking for."}
          action={
            <button
              type="button"
              onClick={() =>
                navigate(user?.role === "student" ? "/dashboard" : "/admin")
              }
              className="button-secondary"
            >
              Go back
            </button>
          }
        />
      </div>
    );
  }

  const timeline = buildTimeline(complaint);
  const attachments = complaint.attachments || [];

  return (
    <div className="page-fade space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-body transition-colors duration-150 hover:text-ink"
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Back
      </button>

      {error ? (
        <div className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-xs text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-ink">
                  {complaint.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                  <span>{formatDateTime(complaint.createdAt)}</span>
                  <span>|</span>
                  <span>{complaint.category}</span>
                  <span>|</span>
                  <PriorityBadge priority={complaint.priority} />
                </div>
              </div>

              <StatusBadge status={complaint.status} />
            </div>

            <div className="mt-6 rounded-md bg-section p-5">
              <p className="text-sm leading-7 text-body">{complaint.description}</p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted">
                Attachments
              </p>
              {attachments.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-3">
                  {attachments.map((attachment, index) => (
                    <a
                      key={attachment.publicId || attachment.url || index}
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-20 w-20 items-center justify-center rounded-md border border-line bg-canvas text-muted transition-colors duration-150 hover:bg-section hover:text-ink"
                    >
                      <Paperclip size={18} strokeWidth={1.8} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No attachments uploaded.</p>
              )}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-sm font-semibold text-ink">Status history</h2>
            <div className="mt-5 space-y-5">
              {timeline.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full bg-ink" />
                    {index < timeline.length - 1 ? (
                      <span className="mt-2 h-full w-px bg-line" />
                    ) : null}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-body">{item.description}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDateTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-ink">Overview</h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-muted">
                  Status
                </dt>
                <dd className="mt-2">
                  <StatusBadge status={complaint.status} />
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-muted">
                  Submitted by
                </dt>
                <dd className="mt-2 flex items-start gap-3 text-body">
                  <div className="mt-0.5 rounded-full bg-section p-2 text-muted">
                    <UserRound size={16} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-medium text-ink">
                      {complaint.createdBy?.name || "Unknown"}
                    </p>
                    <p>{complaint.createdBy?.email || "No email provided"}</p>
                    <p className="text-muted">
                      Room {complaint.roomNumber} | Block {complaint.hostelBlock}
                    </p>
                  </div>
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.06em] text-muted">
                  Assigned to
                </dt>
                <dd className="mt-2 text-body">
                  {complaint.assignedTo?.name || "Not assigned"}
                </dd>
              </div>
            </dl>
          </section>

          {canManage ? (
            <section className="card p-6">
              <h2 className="text-sm font-semibold text-ink">Actions</h2>

              <form onSubmit={handleSave} className="mt-5 space-y-5">
                <div>
                  <label htmlFor="status" className="field-label">
                    Update status
                  </label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value,
                      }))
                    }
                    className="input-base"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="field-label">
                    {form.status === "Rejected" ? "Rejection reason" : "Admin note"}
                  </label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    className="textarea-base"
                    placeholder="Add a short note"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="button-primary w-full"
                >
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <LoaderCircle size={16} className="animate-spin" />
                      Saving
                    </span>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </form>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
