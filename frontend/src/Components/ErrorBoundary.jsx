import { Component } from "react";
import { LuRefreshCw } from "react-icons/lu";
import "../App.css";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page notFoundPage">
          <div className="notFoundContent">
            <h1 style={{ fontSize: "4rem" }}>Oops</h1>
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred. Try refreshing the page or return home.
            </p>
            {this.state.error?.message && (
              <p className="mutedText" style={{ fontSize: "0.85rem", marginBottom: "24px" }}>
                {this.state.error.message}
              </p>
            )}
            <div className="notFoundActions">
              <button className="primaryBtn" onClick={this.handleReset}>
                <LuRefreshCw size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
