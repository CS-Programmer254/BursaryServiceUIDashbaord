function Greeting() {
    const lastLogin = "Feb 22, 2025 at 10:45 AM"; // Replace dynamically if needed
  
    return (
      <div className="bg-white shadow-md rounded-lg p-4 lg:p-6 animate-fadeIn">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
          Welcome Back, <span className="text-blue-600">Stanley</span> 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">Last logged in: {lastLogin}</p>
      </div>
    );
  }
  
  export default Greeting;
  