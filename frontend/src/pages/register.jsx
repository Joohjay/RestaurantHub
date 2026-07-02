import "../App.css";

function Register() {
  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Create Your Account</h1>
          <p>Sign up to start ordering, reserving tables, or managing your restaurant.</p>
        </div>
        <form className="authForm">
          <label>
            Full name
            <input type="text" placeholder="Your full name" />
          </label>
          <label>
            Email address
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Create a password" />
          </label>
          <label>
            Confirm password
            <input type="password" placeholder="Confirm your password" />
          </label>
          <label>
            Role
            <select>
              <option value="customer">Customer</option>
              <option value="owner">Restaurant Owner</option>
            </select>
          </label>
          <button type="submit" className="authButton">
            Register
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