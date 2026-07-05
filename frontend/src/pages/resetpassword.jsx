import "../App.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { getPasswordValidationErrors } from "../utils/validation";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const validation = useMemo(() => {
    const errors = {};
    if (touched.password) {
      const passwordErrors = getPasswordValidationErrors(password);
      if (passwordErrors.length) {
        errors.password = `Password must contain ${passwordErrors.join(", ")}.`;
      }
    }
    if (touched.confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    return errors;
  }, [password, confirmPassword, touched]);

  const isFormValid =
    token &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    getPasswordValidationErrors(password).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to reset password.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Password reset successful. Redirecting...");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(data.user.role === "owner" ? "/owner" : "/dashboard");
        }
      }, 1200);
    } catch (err) {
      setError("Unable to reset password. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Reset Password</h1>
          <p>Create a new password for your account.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            New password
            <div className="passwordField">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Create a new password"
                required
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {validation.password && <span className="fieldError">{validation.password}</span>}
          </label>

          <label>
            Confirm new password
            <div className="passwordField">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError("");
                }}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {validation.confirmPassword && <span className="fieldError">{validation.confirmPassword}</span>}
          </label>

          {error && <p className="authError">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button type="submit" className="authButton" disabled={loading || !isFormValid}>
            {loading ? (
              <><LuLoader className="spin" size={18} /> Resetting...</>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
        <div className="authFooter">
          <p>
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
