import React, { useState } from 'react';
import { db } from '../lib/db';
import { User } from '../types';
import { ShieldCheck, User as UserIcon, Lock, Coins, Save, CheckCircle, RefreshCw, LogOut } from 'lucide-react';

interface ProfileEditProps {
  user: User;
  onProfileUpdated: () => void;
  onLogout: () => void;
}

export default function ProfileEdit({ user, onProfileUpdated, onLogout }: ProfileEditProps) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    
    if (!displayName.trim()) {
      setErrorMsg('⚠️ يرجى إدخال اسم مستخدم صحيح وغير فارغ!');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('⚠️ يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل!');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('⚠️ كلمات المرور المدخلة غير متطابقة!');
      return;
    }

    setLoading(true);

    try {
      // Update local storage and Firestore via direct updates
      const updatedUser: User = {
        ...user,
        displayName: displayName.trim(),
        passwordText: newPassword ? newPassword : user.passwordText
      };

      // Sync to local systems & firestore
      db.updateUserProfile(updatedUser);

      setSuccessMsg('✅ تم تحديث بياناتك الشخصية بنجاح ومزامنتها مع الخوادم!');
      setNewPassword('');
      setConfirmPassword('');
      onProfileUpdated();
    } catch (e: any) {
      setErrorMsg(`❌ حدث خطأ غير متوقع أثناء الحفظ: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-right font-sans max-w-2xl mx-auto" dir="rtl">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-red-500" />
          تعديل الملف الشخصي والبيانات الشخصية
        </h2>
        <span className="text-xs text-slate-400">تحديث بيانات الحساب وكلمة المرور</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Dynamic Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          {/* Read Only Stats Panel */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold block">رصيد النقاط الحالية</span>
              <div className="flex items-center gap-1.5 justify-start text-amber-500 font-extrabold text-lg">
                <Coins className="w-5 h-5" />
                <span>{user.points.toLocaleString()} نقطة</span>
              </div>
            </div>

            <div className="space-y-1 border-r border-slate-800/60 pr-4 text-right">
              <span className="text-[10px] text-slate-500 font-bold block">إجمالي أرباح المحفظة المعلقة</span>
              <div className="flex items-center gap-1 bg-emerald-500/5 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 text-emerald-400 font-extrabold text-base w-fit">
                <span>${(user.dollars || 0).toLocaleString()} دولار</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-350 mb-2">اسم المستخدم بالكامل (بيانات تظهر للعامة)</label>
              <div className="relative">
                <input
                  id="profile-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-right text-white outline-none focus:border-red-550 focus:ring-1 focus:ring-red-500"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-350 mb-2">عنوان البريد الإلكتروني (غير قابل للتعديل للتأمين)</label>
              <input
                type="email"
                readOnly
                value={user.email}
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-right text-slate-500 font-mono outline-none cursor-not-allowed"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/40 space-y-4">
              <h3 className="text-xs font-black text-slate-300">تحديث كلمة مرور الحساب</h3>
              <p className="text-[10px] text-slate-500 -mt-2">إذا كنت لا تريد تغيير كلمة المرور الحالية، يمكنك ترك هذه الحقول فارغة تماماً.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">كلمة مرور جديدة</label>
                  <div className="relative">
                    <input
                      id="profile-new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-right text-white outline-none focus:border-red-550 focus:ring-1 focus:ring-red-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute top-3 right-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                  <div className="relative">
                    <input
                      id="profile-confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-right text-white outline-none focus:border-red-550 focus:ring-1 focus:ring-red-500"
                    />
                    <Lock className="w-4 h-4 text-slate-500 absolute top-3 right-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              id="profile-save-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-550/15 flex-1"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'جاري الحفظ الآمن للبيانات...' : 'حفظ التحديثات والبيانات'}</span>
            </button>

            <button
              id="profile-logout-btn"
              type="button"
              onClick={onLogout}
              className="px-5 py-3 bg-slate-950 hover:bg-slate-850 hover:text-white text-slate-400 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج من الحساب</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
