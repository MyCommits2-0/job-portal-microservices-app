import { useNavigate } from "react-router-dom";

export default function HomeCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg bg-gray-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Complete Your Profile
            </h2>

            <p className="text-gray-500 text-sm mt-3 max-w-sm">
              A complete profile with resume and skills gets noticed faster by recruiters.
            </p>

            <button
              onClick={() => navigate("/candidate/settings")}
              className="mt-5 bg-white text-blue-600 px-5 py-3 rounded-md font-semibold hover:bg-blue-600 hover:text-white"
            >
              Edit Profile →
            </button>
          </div>

          <div className="text-7xl">📝</div>
        </div>

        <div className="rounded-lg bg-blue-600 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="text-2xl font-semibold">Explore More Jobs</h2>

            <p className="text-blue-100 text-sm mt-3 max-w-sm">
              Browse the latest openings and apply to roles that match your skills.
            </p>

            <button
              onClick={() => navigate("/candidate/find-job")}
              className="mt-5 bg-white text-blue-600 px-5 py-3 rounded-md font-semibold hover:bg-blue-50"
            >
              Find Job →
            </button>
          </div>

          <div className="text-7xl">💼</div>
        </div>
      </div>
    </section>
  );
}
