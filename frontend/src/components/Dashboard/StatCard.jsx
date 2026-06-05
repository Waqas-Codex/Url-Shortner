const StatCard = ({ icon, label, value, gradient, delay }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 border border-white/20 dark:border-white/10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-lg"
    style={{ animation: `fadeSlideUp 0.5s ease ${delay}s both` }}
  >
    <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`} />
    <div className="relative flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
)

export default StatCard
