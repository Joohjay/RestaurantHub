function LoadingSpinner({ size = 40, text = "Loading..." }) {
  return (
    <div className="loadingSpinner">
      <div
        className="spinner"
        style={{ width: size, height: size }}
        aria-label={text}
      />
      {text && <p className="spinnerText">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
