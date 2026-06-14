import React, { useState } from 'react';
import { db, auth } from '../lib/db';
import { User } from '../types';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Settings, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

interface SettingsPanelProps {
  user: User;
  onProfileUpdated: () => void;
  lang?: string;
}

export default function SettingsPanel({ user, onProfileUpdated, lang = 'ar' }: SettingsPanelProps) {
  // Profile Editing State
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState(user.passwordText || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Handle profile form submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);
    setIsUpdatingProfile(true);

    if (!displayName.trim()) {
      setProfileErrorMsg(lang === 'ar' ? '⚠️ يرجى إدخال اسم المستخدم!' : '⚠️ Display name is required!');
      setIsUpdatingProfile(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setProfileErrorMsg(lang === 'ar' ? '⚠️ يرجى إدخال بريد إلكتروني صالح!' : '⚠️ Valid email is required!');
      setIsUpdatingProfile(false);
      return;
    }

    try {
      // Step A: Update Firebase authenticated user if active
      const firebaseUser = auth.currentUser;
      let firebaseAuthUpdated = false;

      if (firebaseUser) {
        try {
          if (displayName !== firebaseUser.displayName) {
            await updateProfile(firebaseUser, { displayName });
          }
          if (email !== firebaseUser.email) {
            await updateEmail(firebaseUser, email);
          }
          if (password && password !== user.passwordText) {
            await updatePassword(firebaseUser, password);
          }
          firebaseAuthUpdated = true;
        } catch (authError: any) {
          console.warn('Firebase Auth update failed (might need recent login):', authError);
        }
      }

      // Step B: Update user profile inside Firestore and localStorage regardless of Auth limits
      const updatedUserObj: User = {
        ...user,
        displayName: displayName.trim(),
        email: email.trim(),
        passwordText: password // Update plaintext stored password
      };

      db.updateUserProfile(updatedUserObj);
      onProfileUpdated();

      if (firebaseAuthUpdated) {
        setProfileSuccessMsg(
          lang === 'ar' 
            ? '✅ تم تحديث بيانات حسابك الشخصي وكلمة المرور بنجاح في النظام وفورت تفعيلها!' 
            : '✅ Your profile information and password updated successfully!'
        );
      } else {
        setProfileSuccessMsg(
          lang === 'ar' 
            ? '✅ تم تحديث الاسم والبريد بنجاح محلياً وقاعدة البيانات! قد يتطلب تغيير كلمة المرور والبريد لـ Firebase تسجيل خروج الحساب ودخولك ثانية للامان.' 
            : '✅ Profile updated on database! Password update on Auth requires recent login.'
        );
      }

    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Error updating profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="w-full font-sans max-w-4xl mx-auto space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* HEADER SUMMARY */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center gap-4 flex-row text-right">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Settings className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{lang === 'ar' ? 'إعدادات الحساب والملف الشخصي' : 'Account & Profile Settings'}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar' ? 'تحكم في تفاصيل حسابك وقم بتعديل بيانات المرور لزيادة الأمان' : 'Manage your profile credentials and password security'}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE FORM PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-md max-w-2xl mx-auto space-y-6">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'ar' ? 'تعديل البيانات الأساسية' : 'Edit Credentials'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar' ? 'قم بتعديل اسم الشهرة المسجل والإيميل وكلمة سر الدخول' : 'Update display name, credentials, and account password'}
          </p>
        </div>

        {profileSuccessMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}

        {profileErrorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{profileErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">{lang === 'ar' ? 'اسم المستخدم الحالي:' : 'Display Name:'}</label>
            <div className="relative">
              <UserIcon className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: محمد أحمد' : 'e.g. John Doe'}
                className="w-full pr-10 pl-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">{lang === 'ar' ? 'البريد الإلكتروني للحساب:' : 'Email Address:'}</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pr-10 pl-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-indigo-500 text-left"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">{lang === 'ar' ? 'كلمة المرور الجديدة / الحالية:' : 'New Password / Key:'}</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === 'ar' ? 'أدخل كلمة مرور قوية (لا تقل عن 6 أحرف)' : 'Minimum 6 symbols'}
                className="w-full pr-10 pl-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-indigo-500 text-left font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-500 block leading-relaxed mt-1">
              {lang === 'ar' 
                ? '⚠️ لحفاط أمن حسابك، نوصي بكتابة كلمة مرور مميزة يسهل تذكرها وحفظها.' 
                : 'Please keep password details confidential.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-650 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/10 mt-6"
          >
            {isUpdatingProfile ? (lang === 'ar' ? 'جاري حفظ التعديلات...' : 'Saving changes...') : (lang === 'ar' ? 'حفظ إعدادات الملف الشخصي' : 'Save Details')}
          </button>
        </form>
      </div>

    </div>
  );
}
