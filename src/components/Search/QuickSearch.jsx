function QuickSearch() {
    return (
      <div className="bg-white shadow-md p-4 md:p-6 rounded-lg col-span-2 animate-fadeIn">
        <h2 className="text-lg font-medium">Quick Search</h2>
        <div className="mt-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search by Admission, Phone, ID..."
            className="border p-2 rounded w-full focus:outline-none focus:ring focus:ring-blue-300 transition"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
            Search
          </button>
        </div>
      </div>
    );
  }
  
  export default QuickSearch;
  