import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const hostelBlocks = ["A", "B", "C", "D"];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    roomNumber: "",
    hostelBlock: "A",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      if (form.role === "student") {
        payload.roomNumber = form.roomNumber;
        payload.hostelBlock = form.hostelBlock;
      }

      const response = await register(payload);
      const authenticatedUser = response.data.user;

      navigate(authenticatedUser.role === "student" ? "/dashboard" : "/admin");
    } catch (submitError) {
      setError(submitError.message || "Unable to create your account.");
      setLoading(false);
    }
  };

  return (
    <div className="page-fade w-full">
      <div className="card mx-auto w-full max-w-[440px] p-8">
        <div className="mb-8">
          <p className="text-lg font-semibold text-ink">
            Hostel Complaint System
          </p>
          <p className="mt-2 text-sm text-muted">Create a new account</p>
        </div>

        <div className="mb-6 flex rounded-sm border border-line bg-section p-1 text-sm">
          <Link
            to="/login"
            className="flex-1 rounded-sm px-3 py-2 text-center text-body transition-colors duration-150 hover:text-ink"
          >
            Sign in
          </Link>
          <span className="flex-1 rounded-sm bg-canvas px-3 py-2 text-center font-medium text-ink">
            Register
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="field-label">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="input-base"
              placeholder="Rahul Sharma"
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="field-label">
              Email address
            </label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className="field-label">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="input-base"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="field-label">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
              className="input-base"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {form.role === "student" ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="room-number" className="field-label">
                  Room number
                </label>
                <input
                  id="room-number"
                  type="text"
                  value={form.roomNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      roomNumber: event.target.value,
                    }))
                  }
                  className="input-base"
                  placeholder="101"
                  required
                />
              </div>

              <div>
                <label htmlFor="hostel-block" className="field-label">
                  Hostel block
                </label>
                <select
                  id="hostel-block"
                  value={form.hostelBlock}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      hostelBlock: event.target.value,
                    }))
                  }
                  className="input-base"
                >
                  {hostelBlocks.map((block) => (
                    <option key={block} value={block}>
                      Block {block}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {error ? <p className="text-xs text-danger">{error}</p> : null}

          <button type="submit" disabled={loading} className="button-primary w-full">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                Creating account
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
