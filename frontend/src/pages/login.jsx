import "../App.css";
import { useMemo, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import { isValidEmail } from "../utils/validation";

function Login({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validation = useMemo(() => {
    const errors = {};
    if (touched.email) {
      if (!formData.email.trim()) errors.email = "Email is required.";
      else if (!isValidEmail(formData.email.trim())) errors.email = "Enter a valid email address.";
    }
    if (touched.password && !formData.password) errors.password = "Password is required.";
    return errors;
  }, [formData, touched]);

  const isFormValid =
    formData.email.trim() &&
    isValidEmail(formData.email.trim()) &&
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
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
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
          <p>Log in with your email and password to continue.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {renderFieldError("email")}
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
