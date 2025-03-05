import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "Tech",
    "Entertainment",
    "Acting",
    "Comedy",
    "Standup",
    "Couple",
    "Gaming",
    "Sports",
    "Music",
    "Education",
    "Lifestyle",
    "Fitness",
  ];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
    } else {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  const handleContinue = () => {
    // Store selected categories in localStorage
    localStorage.setItem("categories", JSON.stringify(selectedCategories));
    navigate("/auth/notifications");
  };

  return (
    <div className="page-container">
      <div className="content-container pt-6 md:pt-12">
        <h2 className="mb-2 header">
          Select your category of <br className="md:hidden" />content
        </h2>

        {/* Categories Grid */}
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-10 md:mt-12 md:gap-4 lg:desktop-grid md:justify-center">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-card ${selectedCategories.includes(category) ? "selected" : ""}`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-auto flex justify-center mb-12">
          <button
            className="btn-primary2"
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Categories;