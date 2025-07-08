export default function Pricing() {
  return (
    <section className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-purple-800 mb-6">Transparent Pricing</h2>
      <div className="bg-purple-100 p-6 rounded-xl mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-purple-700">1%</span>
          <span className="text-lg text-gray-700">per transaction</span>
        </div>
        <p className="text-gray-600 mt-2">No monthly fees. No hidden costs. Churches keep more of their giving!</p>
      </div>
      <ul className="list-disc list-inside text-gray-700">
        <li>Instant payouts to your church account</li>
        <li>Dedicated support team</li>
        <li>Cancel any time</li>
      </ul>
    </section>
  );
}