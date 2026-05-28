import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(form.email, form.password);
      const authenticatedUser = response.data.user;

      navigate(
        authenticatedUser.role === "admin" ||
          authenticatedUser.role === "warden" ||
          authenticatedUser.role === "maintenance"
          ? "/admin"
          : "/dashboard",
      );
    } catch (submitError) {
      setError(submitError.message || "Unable to sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="page-fade w-full">
      <div className="card mx-auto w-full max-w-[400px] p-8">
        <div className="mb-8">
          <p className="text-lg font-semibold text-ink">
            Hostel Complaint System
          </p>
          <p className="mt-2 text-sm text-muted">Sign in to your account</p>
        </div>

        <div className="mb-6 flex rounded-sm border border-line bg-section p-1 text-sm">
          <span className="flex-1 rounded-sm bg-canvas px-3 py-2 text-center font-medium text-ink">
            Sign in
          </span>
          <Link
            to="/register"
            className="flex-1 rounded-sm px-3 py-2 text-center text-body transition-colors duration-150 hover:text-ink"
          >
            Register
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="field-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="input-base"
              placeholder="you@college.edu"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="input-base"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? <p className="text-xs text-danger">{error}</p> : null}

          <button type="submit" disabled={loading} className="button-primary w-full">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                Signing in
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
