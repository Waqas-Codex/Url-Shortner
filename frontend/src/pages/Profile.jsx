import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../api/user.api";
import { updateUser } from "../store/slices/authSlice";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const uploadData = new FormData();
      uploadData.append("name", formData.name);
      uploadData.append("username", formData.username);
      uploadData.append("email", formData.email);
      if (avatarFile) {
        uploadData.append("avatar", avatarFile);
      }

      const response = await updateUserProfile(uploadData);
      
      // Update local state to reflect successful backend response
      // User object returned from backend should contain updated avatar url
      if (response && response.user) {
        dispatch(updateUser({
            name: response.user.name,
            username: response.user.username,
            email: response.user.email,
            avatar: response.user.avatar
        }));
      }
      
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .orb-1 { animation: float-slow 8s ease-in-out infinite; }
        .orb-2 { animation: float-slow 10s ease-in-out infinite 2s; }
        .fade-up { animation: fade-up 0.6s ease both; }
        .fade-up-1 { animation: fade-up 0.6s ease 0.1s both; }
        .fade-up-2 { animation: fade-up 0.6s ease 0.2s both; }
        .spin-loader { animation: spin-slow 1s linear infinite; }
      `}</style>

      <div className="relative min-h-screen pt-24 pb-12 flex flex-col items-center justify-center overflow-hidden px-4
                      bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50
                      dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900">
        
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="orb-1 absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full
                          bg-gradient-to-br from-indigo-400/20 to-purple-500/20 blur-3xl" />
          <div className="orb-2 absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full
                          bg-gradient-to-br from-purple-500/10 to-pink-400/20 blur-3xl" />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="fade-up relative z-10 w-full max-w-md">
          {/* Profile Card */}
          <div className="relative rounded-3xl p-8 bg-white/70 dark:bg-gray-900/70
                          border border-white/50 dark:border-white/10
                          backdrop-blur-xl shadow-[0_8px_60px_rgba(99,102,241,0.15)]">
            
            {/* Corner glow */}
            <div className="absolute -top-px -right-px w-32 h-32 rounded-3xl
                            bg-gradient-to-bl from-purple-400/20 to-transparent pointer-events-none" />

            <div className="relative z-10 text-center mb-8">
              <div className="relative inline-block fade-up-1 group">
                <img 
                  src={previewUrl || 'https://via.placeholder.com/150?text=Profile'} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-800 transition-opacity group-hover:opacity-80"
                />
                <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity bg-black/40 rounded-full">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   <span className="text-[10px] text-white font-bold mt-1">Change</span>
                   <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                   />
                </label>
                {!avatarFile && (
                  <div className="absolute bottom-0 right-0 p-1.5 bg-indigo-500 rounded-full text-white shadow-lg border-2 border-white dark:border-gray-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 fade-up-2">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 fade-up-2">Update your personal information</p>
            </div>

            {/* Notifications */}
            {message && (
              <div className="fade-up mb-6 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {message}
              </div>
            )}
            {error && (
              <div className="fade-up mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                 <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5 fade-up-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white placeholder-gray-400
                             focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none
                             transition-all shadow-inner"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 
                             border border-gray-200 dark:border-gray-700
                             text-gray-900 dark:text-white placeholder-gray-400
                             focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none
                             transition-all shadow-inner"
                  placeholder="johndoe123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/80 
                             border border-gray-200 dark:border-gray-700
                             text-gray-500 dark:text-gray-400 placeholder-gray-400 outline-none
                             transition-all shadow-inner cursor-not-allowed"
                  placeholder="john@example.com"
                  title="Email cannot be changed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 
                             bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600
                             text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30
                             transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="spin-loader w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
