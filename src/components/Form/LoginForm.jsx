import React, { useState } from "react";

const LoginForm = ({ onLogin, setError }) => {

  const [phone, setPhone] = useState("");
  
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8084/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        
        onLogin({
          username: data.username, 
          phone: data.phoneNumber,  
          role: data.role,        
          email: data.emailAddress,
          nationalId: data.nationalIdentificationNumber,
        });
      } else {
  
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {

      setError("An error occurred. Please try again.");

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone Number
        </label>
        
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0712345678"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="********"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
