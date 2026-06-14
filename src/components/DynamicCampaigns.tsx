import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { Clock, Award, AlertCircle, Sparkles, X, Send, Play, Compass, ExternalLink, Flame, UserPlus, Tv, ThumbsUp, Heart } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';

interface DynamicCampaignsProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

export default function DynamicCampaigns({ user, onPointsEarned, lang = 'ar' }: DynamicCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCamp, setActiveCamp] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<{ text: string; isError: boolean } | null>(null);
  
  // Custom platform filtering state
  const settings = db.getAdminSettings();
  const customPlatforms = settings.customPlatforms || [];
  const [activePlatformId, setActivePlatformId] = useState<string>('');

  // High precision tracking
  const [hasOpenedLink, setHasOpenedLink] = useState<boolean>(false);
  const [actualSecondsElapsed, setActualSecondsElapsed] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const campaignsPerPage = 10;

  // Set initial active platform
  useEffect(() => {
    if (customPlatforms.length > 0 && !activePlatformId) {
      setActivePlatformId(customPlatforms[0].id);
    }
  }, [customPlatforms, activePlatformId]);

  const loadCampaigns = () => {
    if (!activePlatformId) return;
    const allCampaigns = db.getCampaigns();
    const interactions = db.getHistory();
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === activePlatformId && 
      !interactions.some(i => i.campaignId === c.id && i.userId === user.uid)
    );
    // Sort featured campaigns (isFeatured: true) to the top of the list
    const sorted = [...filtered].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
    setCampaigns(sorted);
  };

  useEffect(() => {
    loadCampaigns();
    const handleUpdate = () => {
      loadCampaigns();
    };
    window.addEventListener('ytsocial_campaigns_updated', handleUpdate);
    return () => {
      window.removeEventListener('ytsocial_campaigns_updated', handleUpdate);
    };
  }, [user.uid, activePlatformId]);

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const startIndex = currentPage * campaignsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, startIndex + campaignsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (currentCampaigns.length === 0 && campaigns.length > 0) {
      setCurrentPage(0);
    }
  }, [campaigns.length, totalPages, currentPage, currentCampaigns.length]);

  // High-precision tracking loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setActualSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const handleStart = (campaign: Campaign) => {
    setActiveCamp(campaign);
    setTimeLeft(15);
    setActualSecondsElapsed(0);
    setHasOpenedLink(false);
    setTimerRunning(false);
    setAlertMsg(null);
  };

  const handleOpenLink = () => {
    if (!activeCamp) return;
    setHasOpenedLink(true);
    setTimerRunning(true);
    window.open(activeCamp.youtubeUrl, '_blank');
  };

  const handleVerifySuccess = (handleUsed: string) => {
    if (!activeCamp) return;
    
    const reward = activeCamp.rewardPerAction || Math.round(activeCamp.pointsPerAction * 0.8);
    const success = db.recordInteraction(user.uid, activeCamp.id, activeCamp.type, reward, handleUsed);
    
    if (success) {
      setAlertMsg({ text: `🎉 رائع! تم إكمال المهمة بنجاح وحساب ${reward} نقطة في محفظتك المعتمدة!`, isError: false });
      onPointsEarned();
      setTimeout(() => {
        setActiveCamp(null);
        setAlertMsg(null);
      }, 2000);
    } else {
      setAlertMsg({ text: '🚫 عذراً، لم تنجح المطابقة. يرجى مراجعة الخطوات وإكمال التفاعل المطلوب.', isError: true });
    }
    setIsVerifying(false);
  };

  // Find dynamic details for UI
  const selectedPlatform = customPlatforms.find(p => p.id === activePlatformId);

  return (
    <div className="w-full text-right font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4 flex-row-reverse">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
            متاح حالياً: {campaigns.length} حملة نشطة
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center justify-end gap-2 text-right">
          المهام الخاصة والمنصات المفتوحة
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </h2>
      </div>

      <p className="text-slate-400 text-xs mb-6 leading-relaxed">
        اكتشف عروض خدمات التفاعل الإضافية التي تم إنشاؤها من قبل رواد الأعمال وصناع المحتوى للمنصات الرقمية الجديدة والمستقلة، واكسب مئات النقاط فور تنفيذه زمنيًا بخصوصية عالية.
      </p>

      {/* Dynamic Tabs Bar */}
      {customPlatforms.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <Compass className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">لا توجد منصات مخصصة مضافة من الإدارة حالياً</p>
          <p className="text-xs text-slate-500">يقوم المسؤولون بإضافة خدمات تواصل اجتماعي مخصصة هنا مثل لينكد إن وتويتر وتليجرام.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6 justify-end border-b border-slate-850 pb-4">
            {customPlatforms.map((p) => {
              const isSelected = activePlatformId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePlatformId(p.id);
                    setCurrentPage(0);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
              <Play className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-300 font-bold mb-1">لا توجد حملات متاحة حالياً لـ {selectedPlatform?.name}</p>
              <p className="text-xs text-slate-500">تفضل بزيارة الخانة لاحقاً أو كن أول من يطلق حملة مميزة لزيادة تفاعل حساباتك الشخصية!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCampaigns.map((camp) => {
                  const reward = camp.rewardPerAction || Math.round(camp.pointsPerAction * 0.8);
                  return (
                     <div key={camp.id} className={`rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px] border ${
                       camp.isFeatured 
                         ? 'bg-gradient-to-l from-slate-900 via-[#1d1604] to-slate-900 border-amber-500/30 shadow-md shadow-amber-950/25' 
                         : 'bg-slate-900 border-slate-800 hover:border-indigo-500/30'
                     }`}>
                       <div>
                         <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                           {camp.creatorId === user.uid ? (
                             <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                               حملتك الإعلانية ⭐️ (معاينة)
                             </span>
                           ) : (
                             <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                               {reward} نقطة
                               <Award className="w-3.5 h-3.5" />
                             </div>
                           )}

                           {camp.isFeatured && (
                             <span className="text-[9px] bg-amber-500/15 text-amber-400 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-0.5 animate-pulse">
                               <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                               مهمة مميزة وعاجلة 🔥
                             </span>
                           )}

                           <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                             15 ثانية
                             <Clock className="w-3.5 h-3.5" />
                           </span>
                         </div>

                         <div className="flex gap-1.5 flex-wrap mb-2.5">
                           <span className="text-[10px] bg-slate-950/50 text-slate-400 border border-slate-850 px-2 py-1 rounded-xl flex items-center gap-1">
                             {(!camp.taskType || camp.taskType === 'subscription') && (
                               <>
                                 <UserPlus className="w-3 h-3 text-indigo-400" />
                                 <span>اشتراك وانضمام لقنوات</span>
                               </>
                             )}
                             {camp.taskType === 'view' && (
                               <>
                                 <Tv className="w-3 h-3 text-emerald-400" />
                                 <span>مشاهدة وتصفح زمني</span>
                               </>
                             )}
                             {camp.taskType === 'like' && (
                               <>
                                 <ThumbsUp className="w-3 h-3 text-pink-400" />
                                 <span>لايك، ريتويت وإعجاب</span>
                               </>
                             )}
                             {camp.taskType === 'follow' && (
                               <>
                                 <UserPlus className="w-3 h-3 text-blue-400" />
                                 <span>متابعة وفولو حسابات</span>
                               </>
                             )}
                             {camp.taskType === 'other' && (
                               <>
                                 <Sparkles className="w-3 h-3 text-teal-400" />
                                 <span>مهمة وتحدي تفاعل مخصص</span>
                               </>
                             )}
                           </span>
                         </div>

                         <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 h-10 mb-2">
                           {camp.title}
                         </h3>
                         <p className="text-xs text-slate-500 font-medium">الحملة بواسطة: {camp.creatorEmail}</p>
                       </div>
 
                       <button
                         onClick={() => handleStart(camp)}
                         className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                           camp.isFeatured
                             ? 'bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border-amber-500/20 text-amber-400'
                             : 'bg-slate-950 hover:bg-indigo-500 hover:text-white border-slate-800 hover:border-indigo-500 text-indigo-400'
                         }`}
                       >
                         <Send className="w-4 h-4" />
                         <span>{camp.creatorId === user.uid ? 'اختبر ومعاينة حملتك الإعلانية' : `تفاعل الآن واكسب ${reward} نقطة`}</span>
                       </button>
                     </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row-reverse">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    <span>السابق &rarr;</span>
                  </button>
                  
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    المجموعة {currentPage + 1} من {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    <span>&larr; التالي</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* POPUP TASK INTERACTION DRAWER */}
      {activeCamp && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl p-6 space-y-6 text-right">
            <button
              onClick={() => {
                setActiveCamp(null);
                setTimerRunning(false);
              }}
              className="absolute top-4 left-4 p-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-full cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-bold">
                {selectedPlatform?.name || 'خدمة تفاعل مخصصة'}
              </span>
              <h3 className="text-base font-black text-white pt-2 leading-snug">{activeCamp.title}</h3>
              <p className="text-xs text-slate-400">يرجى الضغط على الرابط بالأسفل، والانضمام أو التفاعل بشكل طبيعي. ابق في الصفحة المفتوحة لمدة <span className="text-amber-400 font-mono font-bold">15 ثانية</span> على الأقل للمطابقة.</p>
            </div>

            {alertMsg && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                alertMsg.isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {alertMsg.text}
              </div>
            )}

            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex justify-between items-center flex-row-reverse">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <span>زمن البقاء:</span>
                <span className={`font-mono text-sm px-2 py-0.5 rounded ${timeLeft > 0 ? 'bg-slate-900 text-amber-500' : 'bg-emerald-500/10 text-emerald-400 font-black'}`}>
                  {timeLeft > 0 ? `${timeLeft}ث متبقية` : 'جاهز للتحقق!'}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>المكافأة: {activeCamp.rewardPerAction || Math.round(activeCamp.pointsPerAction * 0.8)} نقطة</span>
              </div>
            </div>

            <div className="space-y-3 pb-2 pt-1">
              <button
                onClick={handleOpenLink}
                className="w-full py-3.5 bg-indigo-650 hover:bg-indigo-600 font-extrabold text-sm text-white rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ابدأ المهمة و افتح الرابط الإلكتروني</span>
              </button>

              <button
                disabled={!hasOpenedLink || timeLeft > 0 || isVerifying}
                onClick={() => setIsVerifying(true)}
                className="w-full py-3 bg-slate-950 hover:bg-emerald-600 disabled:bg-slate-900 text-slate-400 hover:text-white disabled:text-slate-650 border border-slate-800 hover:border-emerald-500 disabled:border-slate-900 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
              >
                <Clock className="w-4 h-4" />
                <span>تأكيد المتابعة وحساب النقاط</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-mono leading-relaxed">
              * يقوم روبوت التتبع بالاستعلام التلقائي للتحقق ومطابقة طلبك فور حفظ تفاعلك.
            </p>
          </div>
        </div>
      )}

      {/* RENDER THE REUSABLE VERIFICATION SUITE IN NON-STRICT MODE */}
      {isVerifying && activeCamp && (
        <TaskVerificationOverlay
          isOpen={isVerifying}
          onClose={() => setIsVerifying(false)}
          onSuccess={handleVerifySuccess}
          campaignTitle={activeCamp.title}
          campaignType={activeCamp.type}
          requiredSeconds={15}
          actualSecondsElapsed={actualSecondsElapsed}
          hasOpenedLink={hasOpenedLink}
          campaignId={activeCamp.id}
          campaignUrl={activeCamp.youtubeUrl}
        />
      )}
    </div>
  );
}
