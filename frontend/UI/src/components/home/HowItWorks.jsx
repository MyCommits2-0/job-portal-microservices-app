import { FiUserPlus, FiUploadCloud, FiSearch, FiSend } from "react-icons/fi";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Create account",
      description: "Create your account and complete your basic profile.",
      icon: FiUserPlus,
    },
    {
      id: 2,
      title: "Upload CV/Resume",
      description: "Upload your resume and keep your profile updated.",
      icon: FiUploadCloud,
      active: true,
    },
    {
      id: 3,
      title: "Find suitable job",
      description: "Search and filter jobs based on your preference.",
      icon: FiSearch,
    },
    {
      id: 4,
      title: "Apply job",
      description: "Apply for suitable jobs and track your applications.",
      icon: FiSend,
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
          How jobpilot work
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`rounded-lg p-6 text-center transition ${
                  step.active
                    ? "bg-white shadow-md"
                    : "bg-transparent hover:bg-white hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl ${
                    step.active
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600"
                  }`}
                >
                  <Icon />
                </div>

                <h3 className="font-semibold text-gray-900 mt-5">
                  {step.title}
                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-6">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}