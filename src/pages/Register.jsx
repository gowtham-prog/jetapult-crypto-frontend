
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api.js";


export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username , setUsername ] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess("");
    setLoading(true);
    if(!email || !username || !password || !password2) {
      setError({"message" :"All fields are required"});
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setError({"message" :"Passwords do not match"});
      setLoading(false);
      return;
    }

    if(password.length < 8) {
      setError({"message" :"Password must be at least 8 characters"});
      console.log(error)
      setLoading(false);
      return;
    }

    try {
      await registerUser({ email: email.trim(), password, password2, username: username.trim() });
      setSuccess("Registration successful. Please log in.");
      setTimeout(() => navigate("/login"), 800);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start pt-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Create Account
        </h2>
        
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-300" role="alert">
            {error.message}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100 dark:bg-green-900 dark:text-green-300" role="alert">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input 
                type="email" 
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required 
              />
            </div>
            <div>
              <label 
                htmlFor="username" 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input 
                type="text" 
                id="username"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required 
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input 
                type="password" 
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required 
              />
            </div>

            <div>
              <label 
                htmlFor="password2" 
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <input 
                type="password" 
                id="password2"
                value={password2} 
                onChange={(e) => setPassword2(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <Link 
              to="/login" 
              className="w-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
