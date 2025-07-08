import { FaUserPlus, FaRocket, FaCreditCard, FaHandsHelping, FaChurch, FaUsers } from "react-icons/fa";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-600 dark:from-purple-900 dark:to-gray-900 py-10 px-2 pt-32 md:pt-36">
      <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl px-8 sm:px-12 py-16 flex flex-col items-center border-t-4 border-yellow-300">
        {/* Hero Card */}
        <div className="w-full mb-10">
          <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-xl p-8 sm:p-10 text-white overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 opacity-10 text-9xl select-none pointer-events-none">💜</div>
            <div className="flex items-center gap-6 flex-1">
              <div className="relative">
                <img src="/churpay_logo2.png" alt="ChurPay Logo" className="h-20 w-auto drop-shadow-xl bg-white/10 rounded-2xl p-2" />
                <div className="absolute -bottom-2 w-16 h-1 bg-yellow-300 rounded-full left-1/2 transform -translate-x-1/2"></div>
              </div>
              <div>
                <div className="text-lg font-semibold tracking-wide mb-1">Welcome to</div>
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-200 leading-tight">ChurPay</div>
                <div className="text-xl md:text-2xl text-yellow-100 mt-2 font-medium">The easiest way to give, receive, and manage church finances.<br /><span className="font-semibold text-yellow-200">Simple. Secure. Instant.</span></div>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <a
          href="/signup"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-yellow-300 font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl text-xl tracking-wide mt-3 transform hover:translate-y-[-1px] active:translate-y-[1px] mb-8"
        >
          Get Started Now
        </a>
        {/* Steps */}
        <div className="w-full mt-8">
          <h2 className="text-4xl font-extrabold text-purple-700 dark:text-yellow-300 mb-7 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-yellow-300 dark:to-yellow-400">
              How It Works
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-purple-100 dark:border-purple-700 flex flex-col items-center transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500 duration-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 text-yellow-300 shadow-lg">
                <FaUserPlus className="text-3xl" />
              </div>
              <div className="font-bold text-xl text-purple-800 dark:text-yellow-300 mb-2">Sign Up</div>
              <p className="text-purple-600 dark:text-yellow-100 text-center">Join as a member or church in minutes.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-purple-100 dark:border-purple-700 flex flex-col items-center transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500 duration-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 text-yellow-300 shadow-lg">
                <FaRocket className="text-3xl" />
              </div>
              <div className="font-bold text-xl text-purple-800 dark:text-yellow-300 mb-2">Launch Projects</div>
              <p className="text-purple-600 dark:text-yellow-100 text-center">Churches add tithes, offerings, or special projects.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-purple-100 dark:border-purple-700 flex flex-col items-center transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500 duration-300">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 text-yellow-300 shadow-lg">
                <FaCreditCard className="text-3xl" />
              </div>
              <div className="font-bold text-xl text-purple-800 dark:text-yellow-300 mb-2">Give Instantly</div>
              <p className="text-purple-600 dark:text-yellow-100 text-center">Members give with card or mobile, with digital receipts!</p>
            </div>
          </div>
        </div>
        {/* New Card: Anyone Can Give */}
        <div className="w-full mt-12">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center mb-8 border-2 border-yellow-300 gap-6">
            <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full mb-4 md:mb-0 text-purple-800 shadow-lg flex-shrink-0">
              <FaHandsHelping className="text-4xl" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-2xl md:text-3xl text-purple-800 dark:text-yellow-300 mb-3 text-center md:text-left">Anyone Can Give</div>
              <p className="text-purple-600 dark:text-yellow-100 text-center md:text-left text-lg">
                You do not need to be affiliated with any church to give on ChurPay. Support any church or project, or simply give to make a difference—no account or membership required. Your generosity is always welcome!
              </p>
            </div>
          </div>
          
          {/* New Footer Section: Join Us */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-purple-700 dark:text-yellow-300 mb-4">Ready to experience ChurPay?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-yellow-300 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg tracking-wide transform hover:translate-y-[-1px] flex items-center justify-center gap-2">
                <FaUsers className="text-xl" />
                Sign Up Now
              </a>
              <a href="/login" className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-purple-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg tracking-wide transform hover:translate-y-[-1px] flex items-center justify-center gap-2">
                <FaChurch className="text-xl" />
                Member Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;