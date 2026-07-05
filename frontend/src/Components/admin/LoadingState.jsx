function LoadingState({ message = "Loading..." }) {
  return (
    <div className="dashboardPage">
      <div className="loadingState">
        <div className="loadingSpinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;
