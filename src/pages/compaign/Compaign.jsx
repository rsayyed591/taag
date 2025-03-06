import BottomNavigation from "../../components/BottomNavigation"

function Campaign() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col items-center justify-center">
      <h1 className="header mb-4">Campaigns</h1>
      <p className="sub-header2 text-[#979797]">Coming Soon...</p>

      <BottomNavigation activeTab="campaign" />
    </div>
  )
}

export default Campaign
