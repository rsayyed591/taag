function EmptyState({ type, onNext }) {
  const content = {
    chat: {
      title: "No Chats yet!",
      description: "You can chat once you are part of a campaign.",
      icon: "/icons/chat-empty.svg",
    },
    invoice: {
      title: "No Invoices yet!",
      description: "Create an invoice once you work on a campaign.",
      icon: "/icons/invoice-empty.svg",
    },
  }

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <img src={content[type].icon || "/placeholder.svg"} alt={content[type].title} className="w-20 h-20 mb-4" />
      <h3 className="text-lg font-medium mb-2">{content[type].title}</h3>
      <p className="sub-header w-[151px] md:w-full mb-6">{content[type].description}</p>
      {onNext && (
        <button onClick={onNext} className="px-6 py-2 bg-gray-100 text-[#12766A] rounded-full text-sm font-medium">
          Next
        </button>
      )}
    </div>
  )
}

export default EmptyState

