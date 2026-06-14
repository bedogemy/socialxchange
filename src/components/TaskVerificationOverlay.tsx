import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, AlertTriangle, Cpu, Camera, User } from 'lucide-react';
import { auth, db } from '../lib/db';

interface TaskVerificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profileHandle: string) => void;
  campaignTitle: string;
  campaignType: string;
  requiredSeconds: number;
  actualSecondsElapsed: number;
  hasOpenedLink: boolean;
  windowClosedEarly?: boolean;
  campaignId?: string;
  rewardPoints?: number;
  campaignUrl?: string;
}

export default function TaskVerificationOverlay({
  isOpen,
  onClose,
  onSuccess,
  campaignTitle,
  campaignType,
  requiredSeconds,
  actualSecondsElapsed,
  hasOpenedLink,
  windowClosedEarly = false,
  campaignId,
  rewardPoints,
  campaignUrl,
}: TaskVerificationOverlayProps) {
  const [step, setStep] = useState<number>(5); // Default to 5 (Upload Screenshot)
  const [profileHandle, setProfileHandle] = useState<string>('');
  const [failedReason, setFailedReason] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Anti-Spam state hooks
  const [mathQuestion, setMathQuestion] = useState<{ q: string; a: number }>({ q: '', a: 0 });
  const [userMathAnswer, setUserMathAnswer] = useState<string>('');
  const [delaySecsRemaining, setDelaySecsRemaining] = useState<number>(0);

  const getPlatformLabel = () => {
    const settings = db.getAdminSettings();
    const cust = (settings.customPlatforms || []).find(p => p.id === campaignType);
    if (cust) return cust.name;
    if (campaignType.includes('fb_')) return 'فيسبوك (Facebook Sync)';
    if (campaignType.includes('ig_')) return 'انستجرام (Instagram Connect)';
    if (campaignType.includes('tiktok_')) return 'تيك توك (TikTok Verifier)';
    if (campaignType.includes('tg_')) return 'تليجرام (Telegram Sync)';
    if (campaignType.includes('x_')) return 'إكس (X / Twitter)';
    if (campaignType.includes('pinterest_')) return 'بنترست (Pinterest Connect)';
    return 'يوتيوب (YouTube)';
  };

  const getPlatformKey = () => {
    const settings = db.getAdminSettings();
    const cust = (settings.customPlatforms || []).find(p => p.id === campaignType);
    if (cust) return cust.id;
    if (campaignType.includes('fb_')) return 'facebook';
    if (campaignType.includes('ig_')) return 'instagram';
    if (campaignType.includes('tiktok_')) return 'tiktok';
    if (campaignType.includes('tg_')) return 'telegram';
    if (campaignType.includes('x_')) return 'x';
    if (campaignType.includes('pinterest_')) return 'pinterest';
    return 'youtube';
  };

  // Safe reset when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setStep(5); // Go straight to upload screenshot
      setFailedReason('');
      setSelectedImage(null);
      setIsUploading(false);
      setUserMathAnswer('');
      
      const uid = auth.currentUser?.uid || '';
      const settings = db.getAdminSettings();
      const isCustom = (settings.customPlatforms || []).some(p => p.id === campaignType);
      let saved = localStorage.getItem(`saved_handle_${getPlatformKey()}_${uid}`) || '';
      if (!saved && isCustom) {
        saved = auth.currentUser?.email?.split('@')[0] || '';
      }
      setProfileHandle(saved || '');

      // Anti-Spam: Math verification initialization
      if (localStorage.getItem('guard_math_enabled') === 'true') {
        const num1 = Math.floor(Math.random() * 9) + 4; // 4 to 12
        const num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
        setMathQuestion({
          q: `${num1} + ${num2}`,
          a: num1 + num2
        });
      }

      // Anti-Spam: Interactive Delay Timer (3 - 10 variable seconds based on system pacing settings)
      if (localStorage.getItem('guard_delay_enabled') === 'true') {
        setDelaySecsRemaining(5); // Security block for 5 seconds
      } else {
        setDelaySecsRemaining(0);
      }
    }
  }, [isOpen]);

  // Anti-Spam Countdown timer tick
  useEffect(() => {
    if (isOpen && delaySecsRemaining > 0) {
      const timer = setTimeout(() => {
        setDelaySecsRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, delaySecsRemaining]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح (png, jpg, jpeg...)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async () => {
    if (!selectedImage) return;
    
    const uid = auth.currentUser?.uid || '';
    
    // Anti-Spam: Daily limits check limit block
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyCount = parseInt(localStorage.getItem(`guard_actions_count_${uid}_${todayStr}`) || '0', 10);
    if (localStorage.getItem('guard_daily_limit') === 'true' && dailyCount >= 10) {
      alert('لقد تجاوزت الحد الأقصى للمهام المسموح بها يومياً لتجنب الحظر المؤقت لحسابك (الحد: 10 مهام يومياً).');
      return;
    }

    // Anti-Spam: Validate profile handle constraints
    if (!profileHandle.trim()) {
      alert('الرجاء كتابة اسم حسابك أو المقبض الذي تفاعلت به لتسهيل المراجعة.');
      return;
    }

    if (localStorage.getItem('guard_block_empty') === 'true' && (profileHandle.trim().length < 4 || profileHandle.trim() === '@')) {
      alert('نظام الحماية: يجب إدخال اسم مستخدم حقيقي وكامل (أكثر من 3 أحرف) لمكافحة الحسابات الوهمية.');
      return;
    }

    // Anti-Spam: Validate Math Challenge Answer
    if (localStorage.getItem('guard_math_enabled') === 'true') {
      const numericAns = parseInt(userMathAnswer, 10);
      if (isNaN(numericAns) || numericAns !== mathQuestion.a) {
        alert('نظام الحماية: إجابة مسألة الأمان غير صحيحة. الرجاء المحاولة مرة أخرى.');
        return;
      }
    }

    // Anti-Spam: Delay protection timer
    if (localStorage.getItem('guard_delay_enabled') === 'true' && delaySecsRemaining > 0) {
      alert(`الرجاء الانتظار حتى انتهاء مؤقت الحماية (${delaySecsRemaining} ثانية) لإرسال الإثبات.`);
      return;
    }

    setIsUploading(true);
    setStep(6); // Loading/Uploading screen

    try {
      // Save user handle for next times
      localStorage.setItem(`saved_handle_${getPlatformKey()}_${uid}`, profileHandle);

      // Increment daily verification counter for user
      const currentDayCount = parseInt(localStorage.getItem(`guard_actions_count_${uid}_${todayStr}`) || '0', 10);
      localStorage.setItem(`guard_actions_count_${uid}_${todayStr}`, String(currentDayCount + 1));

      // Submit verification details
      const getTaskUrl = (): string => {
        if (campaignUrl) return campaignUrl;
        if (!campaignId) return '';
        try {
          const campaigns = db.getCampaigns();
          const campaign = campaigns.find(c => c.id === campaignId);
          return campaign?.youtubeUrl || '';
        } catch (e) {
          console.error('Error finding campaign url for verification', e);
          return '';
        }
      };

      const resolvedUrl = getTaskUrl();

      db.submitTaskVerification({
        userId: uid,
        userEmail: auth.currentUser?.email || 'unknown@user.com',
        campaignId: campaignId || 'camp_unknown',
        campaignTitle: campaignTitle,
        campaignType: campaignType,
        rewardPoints: rewardPoints || 40,
        screenshotBase64: selectedImage,
        profileHandle: profileHandle,
        taskId: campaignId || 'camp_unknown',
        taskType: campaignType,
        taskUrl: resolvedUrl
      });

      setStep(3); // Show Success Confirmation screen
    } catch (error) {
      console.error(error);
      setFailedReason('فشل إرسال التوثيق اليدوي للإدارة. يرجى محاولة الرفع لاحقاً.');
      setStep(4);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden text-right">
        
        {/* Colorful Glowing Top Guard rail */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l from-indigo-500 via-purple-500 to-emerald-500"></div>

        {/* STEP 5: UPLOAD SCREENSHOT VIEW */}
        {step === 5 && (
          <div className="space-y-5 py-2 font-sans">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                <span>توثيق مهمة الإتمام بالصورة</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                يرجى رفع لقطة شاشة تدل بوضوح على قيامك بالإجراء المطلوب لـ{' '}
                <span className="text-indigo-400 font-bold">({getPlatformLabel()})</span>:
              </p>
            </div>

            {/* Account Handle Field */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>اسم حسابك أو المقبض للتحقق (Username/Handle):</span>
              </label>
              <input
                type="text"
                value={profileHandle}
                onChange={(e) => setProfileHandle(e.target.value)}
                placeholder="مثال: @your_username"
                className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 text-right"
              />
              {localStorage.getItem('guard_block_empty') === 'true' && profileHandle.trim().length > 0 && profileHandle.trim().length < 4 && (
                <p className="text-[10px] text-amber-500 font-semibold mt-1">
                  ⚠️ الحماية مفعلة: اسم المستخدم قصير جداً قد يتم رفضه تفادياً لتجميد حسابك الأصلي.
                </p>
              )}
            </div>

            {/* Anti-Spam: Visual Math Puzzle Verification */}
            {localStorage.getItem('guard_math_enabled') === 'true' && (
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-indigo-500/10 space-y-2 text-right">
                <div className="flex items-center justify-between gap-1 flex-row-reverse">
                  <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                    <span>تحقق بشري لمنع الروبوتات (Security)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">احسب المسألة التلقائية</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-900 border border-slate-850 px-3 py-2 rounded-xl text-center font-mono font-black text-sm text-white select-none">
                    {mathQuestion.q} = ?
                  </div>
                  <input
                    type="number"
                    value={userMathAnswer}
                    onChange={(e) => setUserMathAnswer(e.target.value)}
                    placeholder="الناتج"
                    className="w-24 p-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-bold text-center focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Dash Box Uploader Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              onClick={() => document.getElementById('screenshot-file-input')?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragOver ? 'border-indigo-400 bg-indigo-950/20 shadow-lg scale-[1.01]' : 'border-slate-805 border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <input
                type="file"
                id="screenshot-file-input"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedImage ? (
                <div className="space-y-4 w-full text-center">
                  <div className="relative inline-block max-w-[190px] rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                    <img src={selectedImage} alt="Screenshot Proof" className="w-full h-auto max-h-[140px] object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                      }}
                      className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-1.5 shadow-md transition cursor-pointer"
                      title="إزالة الصورة"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-emerald-400 font-extrabold flex items-center justify-center gap-1">
                    <span>✓ تم تجهيز لقطة الشاشة بنجاح</span>
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-3 py-2">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-xl mx-auto">
                    📥
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300 font-bold">اسحب صورة لقطة الشاشة وأفلتها هنا</p>
                    <p className="text-[11px] text-slate-500 font-semibold">أو انقر لتصفح الملفات من الهاتف/الكمبيوتر</p>
                  </div>
                  <div className="text-[10px] bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg text-indigo-300 font-semibold inline-block">
                    صيغ مقبولة: PNG, JPG, JPEG
                  </div>
                </div>
              )}
            </div>

            {/* Anti-Spam: Daily Limit blocker message */}
            {localStorage.getItem('guard_daily_limit') === 'true' && (
              <div className="flex items-center justify-between text-[11px] font-bold px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-850 text-slate-400">
                <span>تتبع الحماية اليومية للمهام (Limits):</span>
                <span className="text-indigo-400 font-mono font-black">
                  {parseInt(localStorage.getItem(`guard_actions_count_${auth.currentUser?.uid || 'anonymous'}_${new Date().toISOString().split('T')[0]}`) || '0', 10)} / 10 يومياً
                </span>
              </div>
            )}

            {/* Daily limit block shield alert */}
            {localStorage.getItem('guard_daily_limit') === 'true' && 
             parseInt(localStorage.getItem(`guard_actions_count_${auth.currentUser?.uid || 'anonymous'}_${new Date().toISOString().split('T')[0]}`) || '0', 10) >= 10 && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-2xl leading-relaxed text-right font-semibold">
                🛑 لقد بلغت الحد الأقصى للمهام المسموح بتفاعلها اليوم (10/10) لحماية حسابك وقنواتك من التعليق المؤقت. الرجاء العودة غداً للمتابعة بكفاءة.
              </div>
            )}

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={handleSubmitProof}
                disabled={
                  !selectedImage || 
                  !profileHandle.trim() || 
                  (localStorage.getItem('guard_math_enabled') === 'true' && !userMathAnswer.trim()) ||
                  (localStorage.getItem('guard_delay_enabled') === 'true' && delaySecsRemaining > 0) ||
                  (localStorage.getItem('guard_daily_limit') === 'true' && 
                   parseInt(localStorage.getItem(`guard_actions_count_${auth.currentUser?.uid || 'anonymous'}_${new Date().toISOString().split('T')[0]}`) || '0', 10) >= 10)
                }
                className={`w-full py-3 px-6 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  selectedImage && 
                  profileHandle.trim() && 
                  (localStorage.getItem('guard_math_enabled') !== 'true' || userMathAnswer.trim()) &&
                  (localStorage.getItem('guard_delay_enabled') !== 'true' || delaySecsRemaining === 0) &&
                  (localStorage.getItem('guard_daily_limit') !== 'true' || 
                   parseInt(localStorage.getItem(`guard_actions_count_${auth.currentUser?.uid || 'anonymous'}_${new Date().toISOString().split('T')[0]}`) || '0', 10) < 10)
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white active:scale-[0.98]'
                    : 'bg-slate-850 border border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {localStorage.getItem('guard_delay_enabled') === 'true' && delaySecsRemaining > 0 ? (
                  <span className="flex items-center gap-2">
                    ⏱️ مؤقت الأمان لمطابقة التفاعل: انتظر {delaySecsRemaining}ث
                  </span>
                ) : (
                  <span>🚀 إرسال التوثيق للمراجعة اليدوية</span>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-semibold rounded-xl transition cursor-pointer text-center block"
              >
                إلغاء وإغلاق
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: UPLOADING TIMELINE */}
        {step === 6 && (
          <div className="text-center space-y-6 py-6 font-sans">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
              <div className="mt-4 text-indigo-400 font-extrabold text-sm">
                جاري رفع وحفظ إثبات المهمة...
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              يقوم النظام الآن بتأمين لقطة الشاشة ومقاييس التفاعل في لوحة الإدارة للمراجعة اليدوية. الرجاء عدم إغلاق هذه الصفحة.
            </p>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="text-center space-y-5 py-6 font-sans text-right">
            <div className="flex justify-center mb-1">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-lg font-black text-white">تم إرسال الإثبات بنجاح! 🎉</h3>
              <p className="text-xs text-emerald-400 font-bold">بانتظار مراجعة الإدارة والتحقق اليدوي</p>
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mt-3 text-xs text-slate-400 leading-relaxed text-right font-medium">
                قد قمنا بتسجيل وتوثيق المهمة بنجاح باسم حسابك <span className="text-indigo-400 font-bold font-mono">[{profileHandle}]</span>.
                سيقوم الأدمن بفحص ومطابقة لقطة الشاشة في أقرب وقت لإضافـة مكافأتك ({rewardPoints} نقطة) مباشرة إلى حسابك!
              </div>

              <button
                onClick={() => {
                  onSuccess(profileHandle);
                }}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition cursor-pointer text-center"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FAILURE SCREEN */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4 font-sans">
            <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-500">
              <AlertTriangle className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-rose-400">فشل رفع إثبات المهمة</h3>
              <div className="bg-rose-500/5 text-rose-200 p-4 rounded-xl border border-rose-500/10 text-xs leading-relaxed max-w-sm mx-auto text-right font-sans whitespace-pre-line font-semibold">
                {failedReason}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setStep(5)}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                إعادة المحاولة 📸
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-6 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* Informative Label */}
        <div className="border-t border-slate-850 pt-4 mt-2">
          <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/10 text-right space-y-1">
            <div className="flex items-center gap-2 flex-row-reverse text-indigo-400 font-extrabold text-[11px]">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>نظام التوثيق اليدوي الجديد (Admin Manual Review)</span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-semibold">
              تم إيقاف المراجعة التلقائية لضمان الدقة وتجنب الأخطاء. يتم تدقيق لقطة الشاشة يدوياً بواسطة الإدارة من لوحة التحكم، وسيتم احتساب النقاط فورا فور مراجعة طلبك وتأكيد التفاعل.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
