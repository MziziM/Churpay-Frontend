import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ChurchProfile() {
  const { id } = useParams();
  const [church, setChurch] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/churches/${id}`)
      .then(res => setChurch(res.data))
      .catch(() => setChurch(null));
  }, [id]);

  if (!church) {
    return <div className="p-10 text-center text-lg text-gray-500">Church not found.</div>;
  }

  return (
    <div className="flex flex-col items-center pt-10 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-2xl w-full">
        {church.logo_url && (
          <img
            src={`http://localhost:5000${church.logo_url}`}
            alt="Church Logo"
            className="w-28 h-28 object-cover rounded-full ring-2 ring-purple-300 shadow mb-6 mx-auto"
          />
        )}
        <h1 className="text-3xl font-bold mb-4 text-purple-800">{church.name}</h1>
        <div className="mb-2 text-lg text-gray-800">Lead Pastor: <span className="font-medium">{church.lead_pastor || "N/A"}</span></div>
        <div className="mb-2 text-lg text-gray-800">Contact Person: <span className="font-medium">{church.contact_person || "N/A"}</span></div>
        <div className="mb-2 text-lg text-gray-800">Phone: <span className="font-medium">{church.phone || "N/A"}</span></div>
        <div className="mb-2 text-lg text-gray-800">Email: <span className="font-medium">{church.email || "N/A"}</span></div>
        <div className="mb-2 text-lg text-gray-800">Address: <span className="font-medium">{church.address || "N/A"}</span></div>
        <div className="mb-2 text-lg text-gray-800">Established: <span className="font-medium">{church.established ? new Date(church.established).toLocaleDateString() : "N/A"}</span></div>
        <div className="mb-2 text-purple-600 font-semibold text-base">Status: {church.status || "Active"}</div>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to={`/churches/${church.id}/edit`}
            className="bg-yellow-300 text-purple-800 font-bold px-6 py-3 rounded-lg shadow hover:bg-yellow-400 transition flex items-center"
          >Edit Church</Link>
          <Link
            to="/churches"
            className="bg-purple-700 text-yellow-300 font-bold px-6 py-3 rounded-lg shadow hover:bg-purple-800 transition flex items-center"
          >Back to Directory</Link>
        </div>
      </div>
    </div>
  );
}
