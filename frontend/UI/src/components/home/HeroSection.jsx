import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";

export default function HeroSection() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleFindJob = () => {
    navigate(
      `/candidate/find-job?keyword=${encodeURIComponent(
        keyword
      )}&location=${encodeURIComponent(location)}`
    );
  };

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
            Find a job that suits your interest & skills.
          </h1>

          <p className="text-gray-500 mt-5 max-w-xl leading-7">
            Find jobs that match your skills and career goals. Search by role,
            location, or company and start applying quickly.
          </p>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col md:flex-row gap-3 max-w-3xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-md">
              <FiSearch className="text-blue-600" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Job title, keyword..."
                className="w-full outline-none text-sm"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-md">
              <FiMapPin className="text-blue-600" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                className="w-full outline-none text-sm"
              />
            </div>

            <button
              onClick={handleFindJob}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700"
            >
              Find Job
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}