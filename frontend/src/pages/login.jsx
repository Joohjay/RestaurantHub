import "../App.css";

function Login() {
  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authHeader">
          <h1>Welcome Back</h1>
          <p>Log in to continue ordering, reserving, and managing restaurants.</p>
        </div>
        <form className="authForm">
          <label>
            Email address
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" placeholder="Enter your password" />
          </label>
          <button type="submit" className="authButton">
            Login
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