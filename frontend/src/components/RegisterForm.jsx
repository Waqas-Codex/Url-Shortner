import { useState } from "react";
import { registerUser } from "../api/user.api.js";
import { useNavigate } from "@tanstack/react-router";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice.js";

export default function RegisterForm({state}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // NOTE: User.api allows only password and email right now, 
      // but typically you'd also send 'name'.z
      const data = await registerUser(password, email , name);
      dispatch(login(data.user));
      Navigate({to: '/dashboard'});
      setSuccess("Account created successfully!");
      // TODO: Redirect or update global state here
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.message).join(" | ");
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-6 drop-shadow-sm">
          Create Account
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
            <label className="text-gray-700 dark:text-white/90 text-sm font-semibold ml-1 drop-shadow-sm">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-xl bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all backdrop-blur-md shadow-inner"
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Create a password"
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
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-gray-200 dark:border-white/20 w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">or continue with</span>
          <span className="border-b border-gray-200 dark:border-white/20 w-1/5 lg:w-1/4"></span>
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="mt-4 flex items-center justify-center gap-3 w-full py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm active:scale-[0.98]"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Google</span>
        </a>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-white/80">
          Already have an account?{" "}
          <span  onClick={()=> state(true)} className="cursor-pointer font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors underline-offset-4 hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
