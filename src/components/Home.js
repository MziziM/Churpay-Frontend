function Home() {
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-10">
      <div className="max-w-xl w-full bg-purple-800 rounded-3xl shadow-2xl px-8 py-12 flex flex-col items-center">
        {/* Cartoon Illustration */}
        <img
          src="/cartoon-churpay.svg"
          alt="People paying with ChurPay"
          className="h-32 w-auto mb-6"
        />
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-300 mb-3 text-center drop-shadow-lg">
          Welcome to ChurPay
        </h1>
        {/* Tagline */}
        <p className="text-lg md:text-xl text-yellow-100 text-center mb-6">
          The easiest way to give, receive, and manage church finances.<br />
          <span className="font-semibold text-yellow-200">Simple. Secure. Instant.</span>
        </p>
        {/* CTA */}
        <a
          href="/signup"
          className="bg-yellow-400 text-purple-900 font-extrabold px-8 py-3 rounded-xl shadow-xl text-xl hover:bg-yellow-300 transition mb-8"
        >
          Get Started Now
        </a>
        {/* Steps */}
        <div className="w-full mt-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-7 text-center drop-shadow">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <div className="text-4xl mb-3">📝</div>
              <div className="font-bold text-lg text-purple-800 mb-2">Sign Up</div>
              <p className="text-purple-700 text-center">Join as a member or church in minutes.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <div className="text-4xl mb-3">🚀</div>
              <div className="font-bold text-lg text-purple-800 mb-2">Launch Projects</div>
              <p className="text-purple-700 text-center">Churches add tithes, offerings, or special projects.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform hover:-translate-y-1 hover:scale-105 duration-200">
              <div className="text-4xl mb-3">💳</div>
              <div className="font-bold text-lg text-purple-800 mb-2">Give Instantly</div>
              <p className="text-purple-700 text-center">Members give with card or mobile, with digital receipts!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;