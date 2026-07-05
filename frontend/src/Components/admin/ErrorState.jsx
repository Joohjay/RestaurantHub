function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="dashboardPage">
      <p className="authError">{message}</p>
    </div>
  );
}

export default ErrorState;
