import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { useAuth } from "../context/AuthContext";

export function useChat(chatId) {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId || !user) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }))
      );
    });

    return () => unsubscribe();
  }, [chatId, user]);

  const sendMessage = async (chatId, content, type = 'text') => {
    if (!chatId || !content || !user) return

    try {
      const chatRef = doc(db, 'chats', chatId)
      const messagesRef = collection(chatRef, 'messages')

      await addDoc(messagesRef, {
        content,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        type
      })
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  return { messages, sendMessage };
}
