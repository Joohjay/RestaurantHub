import "../App.css";
import { useMemo, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { isValidEmail, isValidPhone } from "../utils/validation";

function Login({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const identifierType = useMemo(() => {
    const value = formData.identifier.trim();
    if (!value) return null;
    if (isValidEmail(value)) return "email";
    if (isValidPhone(value)) return "phone";
    return "invalid";
  }, [formData.identifier]);

  const validation = useMemo(() => {
    const errors = {};
    if (touched.identifier) {
      if (!formData.identifier.trim()) errors.identifier = "Email or phone number is required.";
      else if (identifierType === "invalid") errors.identifier = "Enter a valid email or phone number.";
    }
    if (touched.password && !formData.password) errors.password = "Password is required.";
    return errors;
  }, [formData, touched, identifierType]);

  const isFormValid =
    formData.identifier.trim() &&
    identifierType !== "invalid" &&
    formData.password;

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ identifier: true, password: true });

    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (setCurrentUser) setCurrentUser(data.user);
      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(data.user.role === "owner" ? "/owner" : "/dashboard");
        }
      }, 800);
    } catch (err) {
      setError("Unable to login. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (field) =>
    validation[field] ? <span className="fieldError">{validation[field]}</span> : null;

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Welcome Back</h1>
          <p>Log in with your email or phone number to continue.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            Email or phone number
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="you@example.com or 0712345678"
              required
            />
            {renderFieldError("identifier")}
          </label>

          <label>
            Password
            <div className="passwordField">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
            {renderFieldError("password")}
          </label>

          <div className="authLinks">
            <Link to="/forgot-password" className="forgotPasswordLink">Forgot password?</Link>
          </div>

          {error && <p className="authError">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button
            type="submit"
            className="authButton"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <LuLoader className="spin" size={18} /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="authFooter">
          <p>
            New to RestaurantHub? <a href="/register">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
