export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input type="text" 
          placeholder="Sheryar Khan" 
           className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input type="email" disabled 
          placeholder="user@example.com" 
           className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"/>
        </div>
        <button 
        className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition shadow-lg shadow-violet-100"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}