import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, Key, CheckCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account credentials and system authorization settings.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-6">
          {/* Header Avatar */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-[2px] shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-bold text-2xl">
                {user?.full_name ? user.full_name[0].toUpperCase() : user?.email[0].toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{user?.full_name || 'Python Developer'}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold mt-1.5">
                <CheckCircle className="w-3 h-3" />
                <span>JWT Authentication Active</span>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Full Name
              </span>
              <p className="text-sm font-semibold text-slate-200">{user?.full_name || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Email Address
              </span>
              <p className="text-sm font-semibold text-slate-200">{user?.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Account Status
              </span>
              <p className="text-sm font-semibold text-emerald-400">Active & Authorized</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Member Since
              </span>
              <p className="text-sm font-semibold text-slate-200">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
