import { useState } from "react";

function ImageWithFallback({ src, alt, className, placeholder, loading = "lazy" }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return placeholder || null;
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}

export default ImageWithFallback;
