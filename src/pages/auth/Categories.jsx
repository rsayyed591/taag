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
    const existingUserData = JSON.parse(localStorage.getItem("currentUser")) || {}; // Get userData
    existingUserData.categories = selectedCategories; // Update creatorDetails
  
    localStorage.setItem("currentUser", JSON.stringify(existingUserData));
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
      </div>

      {/* Footer (Fixed at Bottom) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-6 z-50">
        <button
          className="btn-primary2 w-full max-w-xs"
          onClick={handleContinue}
          disabled={selectedCategories.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Categories;
