import { useEffect } from "react";
import { LuX, LuCircleCheck, LuCircleAlert, LuInfo, LuTriangleAlert } from "react-icons/lu";

const icons = {
  success: <LuCircleCheck size={20} />,
  error: <LuCircleAlert size={20} />,
  info: <LuInfo size={20} />,
  warning: <LuTriangleAlert size={20} />,
};

function Toast({ id, message, type = "info", onClose, duration = 5000 }) {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toastIcon">{icons[type]}</span>
      <span className="toastMessage">{message}</span>
      <button className="toastClose" onClick={() => onClose(id)} aria-label="Close notification">
        <LuX size={16} />
      </button>
    </div>
  );
}

export default Toast;
