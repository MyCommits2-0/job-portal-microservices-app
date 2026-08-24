import { useNavigate } from "react-router-dom";
import { vacanciesData } from "../../data/homeData";

export default function PopularVacancies() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-10">
          Most Popular Vacancies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-7">
          {vacanciesData.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/candidate/find-job?keyword=${encodeURIComponent(item.title)}`)}
              className="text-left"
            >
              <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{item.positions}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}