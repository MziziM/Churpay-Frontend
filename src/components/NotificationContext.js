import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null);

  function notify({ type = "success", message }) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-lg text-lg font-semibold animate-fadeIn
          ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
        `}>
          {toast.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
}