"use client";

import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  ArrowLeft,
  FileText,
  Image,
  MessageSquare,
  Mic,
  MoreVertical,
  Paperclip,
  Send
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../../firebase.config";
import { useAuth } from "../../context/AuthContext";

function ChatScreen() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [receiverName, setReceiverName] = useState("User");

  useEffect(() => {
    if (!chatId) return;

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
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📌 Format Timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: true 
    }).toUpperCase();
  };

  // 📌 Send Text Message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user || !chatId) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");

      await addDoc(messagesRef, {
        content: newMessage.trim(),
        senderId: user.uid,
        type: "text",
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 📌 Upload File (Image or PDF)
  const handleFileUpload = async (file, fileType) => {
    if (!file || !user || !chatId) return;

    const fileRef = ref(storage, `chatFiles/${chatId}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.error("Error uploading file:", error);
        setUploadProgress(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "chats", chatId, "messages"), {
          content: downloadURL,
          senderId: user.uid,
          type: fileType,
          timestamp: serverTimestamp(),
        });
        setUploadProgress(null);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white shadow-sm border-b">
        <button onClick={() => navigate("/home")} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-[#DADADA] rounded-full flex items-center justify-center text-lg font-semibold text-gray-600">
            {receiverName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-800">{receiverName}</h1>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <button className="p-1">
          <MoreVertical className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === user.uid ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-3 rounded-lg shadow-md ${
              message.senderId === user.uid ? "bg-[#DCF8C6]" : "bg-white"
            }`}>
              {message.type === "text" && <p className="text-md text-gray-800">{message.content}</p>}

              {message.type === "image" && (
                <img src={message.content} alt="sent-img" className="w-full h-auto rounded-lg shadow-md object-cover" />
              )}

              {message.type === "pdf" && (
                <a href={message.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  📄 View Document
                </a>
              )}

              <div className="flex justify-end text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="w-full bg-gray-200 h-1">
          <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      {/* Floating Attachments Menu */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-4">
          {/* Image Upload */}
          <input type="file" id="imageUpload" accept="image/*" hidden onChange={(e) => handleFileUpload(e.target.files[0], "image")} />
          <button className="p-3 bg-purple-100 rounded-full flex flex-col items-center" onClick={() => document.getElementById("imageUpload").click()}>
            <Image className="w-6 h-6 text-purple-500" />
            <span className="text-xs mt-1">Photos</span>
          </button>

          {/* PDF Upload */}
          <input type="file" id="pdfUpload" accept="application/pdf" hidden onChange={(e) => handleFileUpload(e.target.files[0], "pdf")} />
          <button className="p-3 bg-green-100 rounded-full flex flex-col items-center" onClick={() => document.getElementById("pdfUpload").click()}>
            <FileText className="w-6 h-6 text-green-500" />
            <span className="text-xs mt-1">Document</span>
          </button>
          <button className="p-3 bg-blue-100 rounded-full flex flex-col items-center">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <span className="text-xs mt-1">Contact</span>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex items-center gap-3">
        <button className="p-2 text-gray-500 rounded-full" onClick={() => setShowAttachMenu(!showAttachMenu)}>
          <Paperclip className="w-6 h-6" />
        </button>

        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm outline-none" ref={inputRef} />

        <button onClick={handleSendMessage} className="text-[#128C7E]">{newMessage.trim() ? <Send className="w-6 h-6" /> : <Mic className="w-6 h-6" />}</button>
      </div>
    </div>
  );
}

export default ChatScreen;
