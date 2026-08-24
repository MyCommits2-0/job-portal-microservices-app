import { FiBriefcase } from "react-icons/fi";

export default function HomeFooter() {
  return (
    <footer className="bg-[#18191c] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <FiBriefcase />
            Jobpilot
          </div>

          <p className="text-gray-400 mt-5">Call now: (319) 555-0115</p>

          <p className="text-gray-500 text-sm mt-3 leading-6">
            6391 Elgin St. Celina, Delaware 10299, New York, United States of America
          </p>
        </div>

        <FooterColumn title="Quick Link" links={["About", "Contact", "Pricing", "Blog"]} />
        <FooterColumn title="Candidate" links={["Browse Jobs", "Browse Employers", "Candidate Dashboard", "Saved Jobs"]} />
        <FooterColumn title="Employers" links={["Post a Job", "Browse Candidates", "Employers Dashboard", "Applications"]} />
        <FooterColumn title="Support" links={["Faqs", "Privacy Policy", "Terms & Conditions"]} />
      </div>

      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <p>© 2025 Jobpilot - Job Portal. All rights Reserved</p>

          <div className="flex gap-4">
            <span>f</span>
            <span>▶</span>
            <span>◎</span>
            <span>𝕏</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold mb-5">{title}</h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <button className="text-gray-400 text-sm hover:text-white">
              {link}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}