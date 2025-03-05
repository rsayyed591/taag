function ChatList({ chats, filter = "all" }) {
  const filteredChats = filter === "unread" ? chats.filter((chat) => chat.unread) : chats

  return (
    <div className="space-y-4">
      {filteredChats.map((chat) => (
        <div key={chat.id} className="flex items-start justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="sub-header2">{chat.name}</h3>
              <span className="sub-header text-[#979797]">{chat.time}</span>
            </div>
            <p className="sub-header text-[#868686]">{chat.message}</p>
          </div>
          {chat.unread && <div className="w-2 h-2 bg-[#12766A] rounded-full ml-2 mt-2" />}
        </div>
      ))}
    </div>
  )
}

export default ChatList

