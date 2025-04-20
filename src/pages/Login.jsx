import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Form/LoginForm";

const Login = ({ setUser }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    console.log(userData);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Rattansi Bursary
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Sign in to your account
            </p>
            <LoginForm onLogin={handleLoginSuccess} setError={setError} />
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
