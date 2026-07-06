import "../App.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { isValidEmail } from "../utils/validation";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validation = useMemo(() => {
    if (!touched) return "";
    if (!email.trim()) return "Email is required.";
    if (!isValidEmail(email.trim())) {
      return "Enter a valid email address.";
    }
    return "";
  }, [email, touched]);

  const isValid = email.trim() && isValidEmail(email.trim());

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
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Request failed.");
        return;
      }

      if (!data.token) {
        setError("No account found with that email address.");
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
          <p>Enter your email to reset your password.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="you@example.com"
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
