import "../App.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { isValidEmail, isValidPhone } from "../utils/validation";

function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validation = useMemo(() => {
    if (!touched) return "";
    if (!identifier.trim()) return "Email or phone number is required.";
    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      return "Enter a valid email or phone number.";
    }
    return "";
  }, [identifier, touched]);

  const isValid = identifier.trim() && (isValidEmail(identifier) || isValidPhone(identifier));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Request failed.");
        return;
      }

      if (!data.token) {
        setError("No account found with that email or phone number.");
        return;
      }

      setSuccess(data.message || "Account verified. Redirecting...");
      setTimeout(() => {
        navigate(`/reset-password?token=${encodeURIComponent(data.token)}`);
      }, 1000);
    } catch (err) {
      setError("Unable to process request. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Forgot Password</h1>
          <p>Enter your email or phone number to reset your password.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            Email or phone number
            <input
              type="text"
              value={identifier}
              onChange={(event) => {
                setIdentifier(event.target.value);
                setError("");
              }}
              placeholder="you@example.com or 0712345678"
              required
            />
            {validation && <span className="fieldError">{validation}</span>}
          </label>

          {error && <p className="authError">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button type="submit" className="authButton" disabled={loading || !isValid}>
            {loading ? (
              <><LuLoader className="spin" size={18} /> Verifying...</>
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <div className="authFooter">
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
