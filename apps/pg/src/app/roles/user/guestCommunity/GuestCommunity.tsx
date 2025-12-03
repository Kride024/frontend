// GuestCommunity.jsx
export default function GuestCommunity() {
  const baseButtonClasses =
    "w-full sm:w-64 px-6 py-3 rounded-full font-semibold shadow-sm transition-colors duration-200 text-lg flex justify-center items-center text-center";

  return (
    <div className="p-4 sm:p-8 font-sans">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3 mb-6 ml-1">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Community & Support
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row justify-around items-stretch gap-4 py-4">
            <button className={`${baseButtonClasses} bg-red-100 text-red-700 hover:bg-red-200`}>
              Emergency Contacts
            </button>
            <button className={`${baseButtonClasses} bg-green-100 text-green-700 hover:bg-green-200`}>
              Chats
            </button>
            <button className={`${baseButtonClasses} bg-yellow-100 text-yellow-700 hover:bg-yellow-200`}>
              FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
