import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { complaintService } from "../services/api.js";

const categories = ["Plumbing", "Electricity", "Cleaning", "Furniture", "Other"];
const priorities = ["Low", "Medium", "High"];

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Plumbing",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!user?.roomNumber || !user?.hostelBlock) {
      setError("Your profile needs a room number and hostel block before you can submit a complaint.");
      setLoading(false);
      return;
    }

    try {
      await complaintService.createComplaint({
        ...form,
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
      });

      setSuccess(true);
      setLoading(false);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message || "Unable to submit complaint.",
      );
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-fade mx-auto max-w-[480px]">
        <div className="card p-8 text-center">
          <CheckCircle2
            size={24}
            strokeWidth={1.8}
            className="mx-auto text-success"
          />
          <h1 className="mt-4 text-lg font-semibold text-ink">
            Complaint submitted
          </h1>
          <p className="mt-2 text-sm text-muted">
            Your complaint has been recorded and is now waiting for review.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                setForm({
                  title: "",
                  description: "",
                  category: "Plumbing",
                  priority: "Medium",
                });
                setSuccess(false);
              }}
              className="button-secondary"
            >
              Submit another
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="button-primary"
            >
              View dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-fade mx-auto max-w-[480px] space-y-6">
      <div>
        <h1 className="text-[20px] font-semibold text-ink">Create complaint</h1>
        <p className="mt-2 text-sm text-muted">
          Share the issue clearly so the team can help faster.
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="field-label">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="input-base"
              placeholder="Broken tap in the washroom"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="field-label">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
              className="input-base"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="field-label">
              Priority
            </label>
            <select
              id="priority"
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  priority: event.target.value,
                }))
              }
              className="input-base"
            >
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="field-label">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="textarea-base"
              placeholder="Describe the issue in a few sentences."
              maxLength={1000}
              required
            />
          </div>

          {error ? <p className="text-xs text-danger">{error}</p> : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="button-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" />
                  Submitting
                </span>
              ) : (
                "Submit complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
