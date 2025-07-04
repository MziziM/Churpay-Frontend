import { FaUserPlus, FaRocket, FaCreditCard, FaHandsHelping } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-500 dark:from-purple-900 dark:to-gray-900 py-10 px-2">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl px-12 py-16 flex flex-col items-center">
        {/* Hero Card */}
        <div className="w-full mb-10">
          <div className="relative bg-gradient-to-br from-purple-700 to-indigo-500 rounded-3xl shadow-xl p-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
            <div className="flex items-center gap-6 flex-1">
              <img src="/churpay_logo.png" alt="ChurPay Logo" className="h-20 w-auto drop-shadow-xl bg-white/10 rounded-2xl p-2" />
              <div>
                <div className="text-lg font-semibold tracking-wide mb-1">Welcome to</div>
                <div className="text-4xl md:text-5xl font-extrabold text-yellow-300 leading-tight">ChurPay</div>
                <div className="text-xl md:text-2xl text-yellow-100 mt-2 font-medium">The easiest way to give, receive, and manage church finances.<br /><span className="font-semibold text-yellow-200">Simple. Secure. Instant.</span></div>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <a
          href="/signup"
          className="bg-yellow-400 text-purple-900 font-extrabold px-10 py-4 rounded-xl shadow-xl text-2xl hover:bg-yellow-300 transition mb-8"
        >
          Get Started Now
        </a>
        {/* Steps */}
        <div className="w-full mt-8">
          <h2 className="text-3xl font-bold text-yellow-300 mb-7 text-center drop-shadow">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <FaUserPlus className="text-5xl text-purple-800 mb-3" />
              <div className="font-bold text-xl text-purple-800 mb-2">Sign Up</div>
              <p className="text-purple-700 dark:text-yellow-100 text-center">Join as a member or church in minutes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <FaRocket className="text-5xl text-purple-800 mb-3" />
              <div className="font-bold text-xl text-purple-800 mb-2">Launch Projects</div>
              <p className="text-purple-700 dark:text-yellow-100 text-center">Churches add tithes, offerings, or special projects.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <FaCreditCard className="text-5xl text-purple-800 mb-3" />
              <div className="font-bold text-xl text-purple-800 mb-2">Give Instantly</div>
              <p className="text-purple-700 dark:text-yellow-100 text-center">Members give with card or mobile, with digital receipts!</p>
            </div>
          </div>
        </div>
        {/* New Card: Anyone Can Give */}
        <div className="w-full mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col items-center mb-8 border-2 border-yellow-300">
            <FaHandsHelping className="text-6xl text-yellow-400 mb-3" />
            <div className="font-bold text-2xl text-purple-800 mb-2">Anyone Can Give</div>
            <p className="text-purple-700 dark:text-yellow-100 text-center max-w-md text-lg">
              You do not need to be affiliated with any church to give on ChurPay. Support any church or project, or simply give to make a difference—no account or membership required. Your generosity is always welcome!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;