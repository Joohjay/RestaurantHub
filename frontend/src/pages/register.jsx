import "../App.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff, LuLoader } from "react-icons/lu";
import { API_URL } from "../config";
import {
  getPasswordValidationErrors,
  isStrongEnoughPassword,
  isValidEmail,
  isValidPhone,
  normalizePhone,
} from "../utils/validation";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "customer",
};

function Register({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validation = useMemo(() => {
    const errors = {};
    if (touched.name && !formData.name.trim()) errors.name = "Full name is required.";

    if (touched.email) {
      if (!formData.email.trim()) errors.email = "Email address is required.";
      else if (!isValidEmail(formData.email)) errors.email = "Enter a valid email address.";
    }

    if (touched.phone) {
      if (!formData.phone.trim()) errors.phone = "Phone number is required.";
      else if (!isValidPhone(formData.phone)) errors.phone = "Enter a valid Tanzanian phone number.";
    }

    if (touched.password) {
      const passwordErrors = getPasswordValidationErrors(formData.password);
      if (passwordErrors.length) {
        errors.password = `Password must contain ${passwordErrors.join(", ")}.`;
      }
    }

    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  }, [formData, touched]);

  const isFormValid =
    formData.name.trim() &&
    isValidEmail(formData.email) &&
    isValidPhone(formData.phone) &&
    isStrongEnoughPassword(formData.password) &&
    formData.password === formData.confirmPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: normalizePhone(formData.phone),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (setCurrentUser) setCurrentUser(data.user);
      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(data.user.role === "owner" ? "/owner" : "/dashboard");
        }
      }, 1200);
    } catch (err) {
      setError("Unable to register. Please try again later.");
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
          <h1>Create Your Account</h1>
          <p>Sign up to start ordering, reserving tables, or managing your restaurant.</p>
        </div>
        <form className="authForm" onSubmit={handleSubmit} noValidate>
          <label>
            Full name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            {renderFieldError("name")}
          </label>

          <label>
            Email address
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
            Phone number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0712345678 or +255712345678"
              required
            />
            {renderFieldError("phone")}
          </label>

          <label>
            Password
            <div className="passwordField">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
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

          <label>
            Confirm password
            <div className="passwordField">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="passwordToggle"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
            {renderFieldError("confirmPassword")}
          </label>

          <label>
            Role
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
            </select>
          </label>

          {error && <p className="authError">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button
            type="submit"
            className="authButton"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <LuLoader className="spin" size={18} /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="authFooter">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
