import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Check, Search, AlertCircle, UserPlus } from 'lucide-react';
import { IonAlert } from "@ionic/react";

function Managers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [managers, setManagers] = useState([]);
  const [requestedManagers, setRequestedManagers] = useState([]);
  const [rejectedManagers, setRejectedManagers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const [activeTab, setActiveTab] = useState("confirmed");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];
    const activeProfileId = localStorage.getItem("activeProfileId");

    if (activeProfileId) {
      const currentProfile = storedProfiles.find(
        (profile) => String(profile.id) === String(activeProfileId)
      );

      if (currentProfile) {
        setActiveProfile(currentProfile);
        
        // Set managers lists
        setManagers(currentProfile.managers || []);
        // console.log(currentProfile.managers);
        setRequestedManagers(currentProfile.requestedManagers || []);
        setRejectedManagers(currentProfile.rejectedManagers || []);
        setPendingRequests(currentProfile.pendingRequests || []);
        
        const updatedProfiles = storedProfiles.filter(
          (profile) => String(profile.id) !== String(activeProfileId)
        );
        
        setProfiles(updatedProfiles);
      }
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setAlertMessage("Please enter a name or username to search");
      setShowAlert(true);
      return;
    }

    const results = profiles.filter(
      (profile) =>
        profile.creatorDetails.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.creatorDetails.instagram.url?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setShowNoResults(results.length === 0);
  };

  const updateProfileInStorage = (profileId, updates) => {
    const storedProfiles = JSON.parse(localStorage.getItem("userProfiles")) || [];
    const updatedProfiles = storedProfiles.map(profile => 
      String(profile.id) === String(profileId) ? { ...profile, ...updates } : profile
    );
    
    localStorage.setItem("userProfiles", JSON.stringify(updatedProfiles));
    
    // If we're updating the active profile, refresh our state
    if (String(profileId) === String(activeProfile.id)) {
      loadProfileData();
    }
  };

  const handleRequestManager = (targetProfile) => {
    if (!activeProfile) return;
    
    // Check if already in any list
    const isAlreadyRequested = requestedManagers.some(
      m => String(m.id) === String(targetProfile.id)
    );
    
    const isAlreadyManager = managers.some(
      m => String(m.id) === String(targetProfile.id)
    );
    
    const isAlreadyRejected = rejectedManagers.some(
      m => String(m.id) === String(targetProfile.id)
    );
    
    if (isAlreadyRequested || isAlreadyManager || isAlreadyRejected) {
      setAlertMessage("This user is already in your managers list or has been requested");
      setShowAlert(true);
      return;
    }
    
    // Add to requested managers for active profile
    const updatedRequestedManagers = [
      ...(activeProfile.requestedManagers || []),
      {
        id: targetProfile.id,
        name: targetProfile.name,
        username: targetProfile.username,
        avatar: targetProfile.avatar,
        requestedAt: new Date().toISOString()
      }
    ];
    
    // Update active profile
    updateProfileInStorage(activeProfile.id, {
      requestedManagers: updatedRequestedManagers
    });
    
    // Add pending request to target profile
    const targetPendingRequests = [
      ...(targetProfile.pendingRequests || []),
      {
        id: activeProfile.id,
        name: activeProfile.name,
        username: activeProfile.username,
        avatar: activeProfile.avatar,
        requestedAt: new Date().toISOString()
      }
    ];
    
    // Update target profile
    updateProfileInStorage(targetProfile.id, {
      pendingRequests: targetPendingRequests
    });
    
    setAlertMessage("Manager request sent successfully");
    setShowAlert(true);
    
    // Update local state
    setRequestedManagers(updatedRequestedManagers);
    
    // Clear search
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleAcceptRequest = (request) => {
    if (!activeProfile) return;
    
    // Add to managers list for active profile
    const updatedManagers = [
      ...(activeProfile.managers || []),
      {
        id: request.id,
        name: request.name,
        username: request.username,
        avatar: request.avatar,
        acceptedAt: new Date().toISOString()
      }
    ];
    
    // Remove from pending requests
    const updatedPendingRequests = (activeProfile.pendingRequests || [])
      .filter(req => String(req.id) !== String(request.id));
    
    // Update active profile
    updateProfileInStorage(activeProfile.id, {
      managers: updatedManagers,
      pendingRequests: updatedPendingRequests
    });
    
    // Update requester's profile - move from requested to confirmed
    const requesterProfile = profiles.find(
      profile => String(profile.id) === String(request.id)
    );
    
    if (requesterProfile) {
      // Remove from requested managers
      const updatedRequesterRequestedManagers = (requesterProfile.requestedManagers || [])
        .filter(req => String(req.id) !== String(activeProfile.id));
      
      // Add to confirmed managers
      const updatedRequesterManagers = [
        ...(requesterProfile.managers || []),
        {
          id: activeProfile.id,
          name: activeProfile.name,
          username: activeProfile.username,
          avatar: activeProfile.avatar,
          acceptedAt: new Date().toISOString()
        }
      ];
      
      // Update requester profile
      updateProfileInStorage(request.id, {
        requestedManagers: updatedRequesterRequestedManagers,
        managers: updatedRequesterManagers
      });
    }
    
    // Update local state
    setManagers(updatedManagers);
    setPendingRequests(updatedPendingRequests);
    
    setAlertMessage("Manager request accepted");
    setShowAlert(true);
  };

  const handleRejectRequest = (request) => {
    if (!activeProfile) return;
    
    // Add to rejected managers for active profile
    const updatedRejectedManagers = [
      ...(activeProfile.rejectedManagers || []),
      {
        id: request.id,
        name: request.name,
        username: request.username,
        avatar: request.avatar,
        rejectedAt: new Date().toISOString()
      }
    ];
    
    // Remove from pending requests
    const updatedPendingRequests = (activeProfile.pendingRequests || [])
      .filter(req => String(req.id) !== String(request.id));
    
    // Update active profile
    updateProfileInStorage(activeProfile.id, {
      rejectedManagers: updatedRejectedManagers,
      pendingRequests: updatedPendingRequests
    });
    
    // Update requester's profile - move from requested to rejected
    const requesterProfile = profiles.find(
      profile => String(profile.id) === String(request.id)
    );
    
    if (requesterProfile) {
      // Remove from requested managers
      const updatedRequesterRequestedManagers = (requesterProfile.requestedManagers || [])
        .filter(req => String(req.id) !== String(activeProfile.id));
      
      // Add to rejected by list
      const updatedRequesterRejectedBy = [
        ...(requesterProfile.rejectedBy || []),
        {
          id: activeProfile.id,
          name: activeProfile.name,
          username: activeProfile.username,
          avatar: activeProfile.avatar,
          rejectedAt: new Date().toISOString()
        }
      ];
      
      // Update requester profile
      updateProfileInStorage(request.id, {
        requestedManagers: updatedRequesterRequestedManagers,
        rejectedBy: updatedRequesterRejectedBy
      });
    }
    
    // Update local state
    setRejectedManagers(updatedRejectedManagers);
    setPendingRequests(updatedPendingRequests);
    
    setAlertMessage("Manager request rejected");
    setShowAlert(true);
  };

  const handleRemoveManager = (manager) => {
    if (!activeProfile) return;
    
    // Remove from managers list
    const updatedManagers = (activeProfile.managers || [])
      .filter(m => String(m.id) !== String(manager.id));
    
    // Update active profile
    updateProfileInStorage(activeProfile.id, {
      managers: updatedManagers
    });
    
    // Update the other profile too
    const targetProfile = profiles.find(
      profile => String(profile.id) === String(manager.id)
    );
    
    if (targetProfile) {
      const updatedTargetManagers = (targetProfile.managers || [])
        .filter(m => String(m.id) !== String(activeProfile.id));
      
      updateProfileInStorage(manager.id, {
        managers: updatedTargetManagers
      });
    }
    
    // Update local state
    setManagers(updatedManagers);
    
    setAlertMessage("Manager removed successfully");
    setShowAlert(true);
  };

  const handleCancelRequest = (manager) => {
    if (!activeProfile) return;
    
    // Remove from requested managers
    const updatedRequestedManagers = (activeProfile.requestedManagers || [])
      .filter(m => String(m.id) !== String(manager.id));
    
    // Update active profile
    updateProfileInStorage(activeProfile.id, {
      requestedManagers: updatedRequestedManagers
    });
    
    // Update the other profile too
    const targetProfile = profiles.find(
      profile => String(profile.id) === String(manager.id)
    );
    
    if (targetProfile) {
      const updatedPendingRequests = (targetProfile.pendingRequests || [])
        .filter(req => String(req.id) !== String(activeProfile.id));
      
      updateProfileInStorage(manager.id, {
        pendingRequests: updatedPendingRequests
      });
    }
    
    // Update local state
    setRequestedManagers(updatedRequestedManagers);
    
    setAlertMessage("Request cancelled successfully");
    setShowAlert(true);
  };

  const renderManagerCard = (manager, type) => {
    return (
      <div key={manager.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#12766A20] rounded-full flex items-center justify-center overflow-hidden">
            {manager.avatar ? (
              <img src={manager.avatar || "/placeholder.svg"} alt={manager.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[#12766A] font-medium">{manager.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium">{manager.name || "User"}</h3>
            <p className="text-sm text-gray-500">{manager.username || "@user"}</p>
          </div>
        </div>
        
        {type === "pending" && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleRejectRequest(manager)} 
              className="p-2 bg-red-50 text-red-500 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleAcceptRequest(manager)} 
              className="p-2 bg-[#12766A10] text-[#12766A] rounded-full"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {type === "confirmed" && (
          <button 
            onClick={() => handleRemoveManager(manager)} 
            className="p-2 bg-red-50 text-red-500 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {type === "requested" && (
          <button 
            onClick={() => handleCancelRequest(manager)} 
            className="p-2 bg-red-50 text-red-500 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white shadow-sm">
        <button onClick={() => navigate("/profile")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium">Manage Managers</h1>
      </div>

      {/* Search Section */}
      <div className="p-4 bg-white shadow-sm mb-4">
        <h2 className="text-base font-medium mb-3">Add New Manager</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowNoResults(false);
              }}
              placeholder="Search by name or username"
              className="w-full p-2 pl-9 border border-gray-300 rounded-md"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <button 
            onClick={handleSearch}
            className="px-4 py-2 bg-[#12766A] text-white rounded-md"
          >
            Search
          </button>
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-500">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#12766A20] rounded-full flex items-center justify-center overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#12766A] font-medium">{profile.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{profile.name || "User"}</h3>
                      <p className="text-sm text-gray-500">{profile.username || "@user"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRequestManager(profile)} 
                    className="p-2 bg-[#12766A10] text-[#12766A] rounded-full"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showNoResults && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "confirmed"
                ? "text-[#12766A] border-b-2 border-[#12766A]"
                : "text-gray-500"
            }`}
          >
            Confirmed ({managers.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "pending"
                ? "text-[#12766A] border-b-2 border-[#12766A]"
                : "text-gray-500"
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("requested")}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "requested"
                ? "text-[#12766A] border-b-2 border-[#12766A]"
                : "text-gray-500"
            }`}
          >
            Requested ({requestedManagers.length})
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="px-4">
        {activeTab === "confirmed" && (
          <>
            {managers.length > 0 ? (
              <div>
                {managers.map(manager => renderManagerCard(manager, "confirmed"))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>You don't have any confirmed managers yet</p>
                <p className="text-sm mt-1">Search for users to add them as managers</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === "pending" && (
          <>
            {pendingRequests.length > 0 ? (
              <div>
                {pendingRequests.map(request => renderManagerCard(request, "pending"))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending manager requests</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === "requested" && (
          <>
            {requestedManagers.length > 0 ? (
              <div>
                {requestedManagers.map(manager => renderManagerCard(manager, "requested"))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>You haven't requested any managers yet</p>
                <p className="text-sm mt-1">Search for users to request them as managers</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Notification"
        message={alertMessage}
        buttons={["OK"]}
      />
    </div>
  );
}

export default Managers;
