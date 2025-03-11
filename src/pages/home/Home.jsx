"use client";

import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase.config";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  // Fetch all users except the logged-in user
  useEffect(() => {
    if (!user) return;

    const usersQuery = query(
      collection(db, "users"),
      where("uid", "!=", user.uid)
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleStartChat = async (userId) => {
    if (!user) return;

    try {
      const chatsRef = collection(db, "chats");
      const chatQuery = query(
        chatsRef,
        where("participants", "array-contains", user.uid)
      );

      const chatSnapshot = await getDocs(chatQuery);
      let existingChat = null;

      chatSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(userId)) {
          existingChat = { id: doc.id, ...data };
        }
      });

      let chatId;
      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new chat
        const newChatRef = await addDoc(collection(db, "chats"), {
          participants: [user.uid, userId],
          createdAt: serverTimestamp(),
          lastMessage: "",
          lastMessageTime: serverTimestamp(),
          [`lastRead.${user.uid}`]: serverTimestamp(),
          [`lastRead.${userId}`]: null,
        });

        chatId = newChatRef.id;
      }

      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 py-6 md:px-8 md:py-12">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>

        <SearchBar onSearch={() => {}} onFilter={() => {}} />

        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((otherUser) => (
              <div
                key={otherUser.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:bg-gray-50"
                onClick={() => handleStartChat(otherUser.id)}
              >
                <div>
                  <h3 className="font-medium">{otherUser.name}</h3>
                  <p className="text-sm text-gray-500">{otherUser.phoneNumber}</p>
                </div>
                <button className="px-4 py-2 bg-[#12766A] text-white rounded-lg">
                  Chat
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState type="chat" />
        )}
      </div>

      <BottomNavigation activeTab="home" />
    </div>
  );
}

export default Home;
