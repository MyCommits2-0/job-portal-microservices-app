import { NavLink } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function ProfileCompletionBanner() {
  return (
    <div className="bg-red-500 rounded-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="candidate"
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h2 className="text-white font-semibold">
            Your profile editing is not completed.
          </h2>
          <p className="text-red-100 text-sm mt-1">
            Complete your profile editing & build your custom Resume
          </p>
        </div>
      </div>

      <NavLink
        to="/candidate/settings"
        className="bg-white text-red-500 px-5 py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-red-50"
      >
        Edit Profile
        <FiArrowRight />
      </NavLink>
    </div>
  );
}
