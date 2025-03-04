import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Categories() {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])

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
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category))
    } else {
      setSelectedCategories((prev) => [...prev, category])
    }
  }

  const handleContinue = () => {
    // Store selected categories in localStorage
    localStorage.setItem("categories", JSON.stringify(selectedCategories))
    navigate("/notifications")
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-6">
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h2 className="mb-2 text-2xl leading-[32.78px] font-manrope font-medium">Select your category of <br />content</h2>

        {/* Categories Grid */}
<div className="flex flex-wrap gap-x-2 gap-y-2 mt-10">
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
        <div className="mt-auto flex justify-center">
          <button className="btn-primary2 mb-12" onClick={handleContinue} disabled={selectedCategories.length === 0}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default Categories