import { useState } from "react";
import { LoginUser } from "../api/user.api.js";
import {useSelector , useDispatch} from "react-redux"
import { login } from "../store/slices/authSlice.js";
import { useNavigate } from "@tanstack/react-router";

export default function LoginForm({state}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth);
  console.log(auth);
  
  
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await LoginUser(password, email);
      dispatch(login(data.user));
      navigate({to: '/dashboard'});
      // Assume successful login returns some token or message
      setSuccess(data.message || "Login successful");
      console.log("Login successful:", data);
      // TODO: Redirect or update global state here
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-6 drop-shadow-sm">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-400/20 border border-red-500/50 rounded-xl text-red-700 dark:text-red-200 text-sm text-center shadow-inner font-medium backdrop-blur-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-400/20 border border-green-500/50 rounded-xl text-green-700 dark:text-green-200 text-sm text-center shadow-inner font-medium backdrop-blur-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 dark:text-white/90 text-sm font-semibold ml-1 drop-shadow-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-md shadow-inner"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-700 dark:text-white/90 text-sm font-semibold ml-1 drop-shadow-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-md shadow-inner"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed border border-transparent text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-white/80">
          Don't have an account?{" "}
          <span 
            className="cursor-pointer font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors underline-offset-4 hover:underline"
            onClick={() => state(false)}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
