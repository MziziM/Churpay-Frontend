import { useNavigate } from "react-router-dom";

const DEMO_USERS = [
  {
    label: "Church Demo",
    token: "church1token",
    path: "/church_dashboard"
  },
  {
    label: "Member Demo",
    token: "member1token",
    path: "/transactions" // Or your member dashboard path!
  },
  {
    label: "Admin Demo",
    token: "admintoken",
    path: "/admin" // Change if you use a different admin dashboard path
  }
];

export default function DemoLogin() {
  const navigate = useNavigate();

  function handleDemoLogin(user) {
    localStorage.setItem("churpay_token", user.token);
    navigate(user.path);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Welcome to ChurPay</h2>
        <p className="mb-6 text-gray-500 text-center">
          Explore ChurPay as different users. Choose a demo login below:
        </p>
        <div className="w-full flex flex-col gap-4 mb-2">
          {DEMO_USERS.map((user, i) => (
            <button
              key={i}
              onClick={() => handleDemoLogin(user)}
              className="w-full bg-purple-700 text-yellow-300 font-bold py-3 rounded-xl shadow hover:bg-purple-800 transition"
            >
              {user.label}
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-400 text-center">
          No password needed. <br />
          Want a real account? <a href="/signup" className="text-purple-700 underline">Sign up here</a>.
        </div>
      </div>
    </div>
  );
}