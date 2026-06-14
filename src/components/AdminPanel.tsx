import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { User, Campaign, CryptoPayment, AdminSettings, UserReview, UserComplaint, TaskVerification } from '../types';
import { ShieldCheck, Users, Link2, Coins, Wallet, Check, X, Trash2, Edit3, Save, Search, Sparkles, Pause, Play, Megaphone, Star, MessageSquare, Mail, Send, Facebook, Youtube, Instagram, Flame, Phone, MessageCircle, PlusCircle, Plus, HelpCircle, ExternalLink, Eye, Pin, Compass } from 'lucide-react';

interface AdminPanelProps {
  onAdminActionDone: () => void;
  lang?: string;
}

export default function AdminPanel({ onAdminActionDone, lang = 'en' }: AdminPanelProps) {
  // Login lock states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_session_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Config sections: 'payments' | 'campaigns' | 'users' | 'wallets' | 'ads' | 'support' | 'points_config' | 'withdrawals' | 'verifications' | 'linking_config' | 'exchange_config' | 'custom_campaigns' | 'pricing_packages_config'
  const [adminTab, setAdminTab] = useState<'payments' | 'campaigns' | 'users' | 'wallets' | 'ads' | 'support' | 'points_config' | 'withdrawals' | 'verifications' | 'linking_config' | 'exchange_config' | 'custom_campaigns' | 'pricing_packages_config'>('payments');
  const [usersFilter, setUsersFilter] = useState('');
  const [verificationsFilter, setVerificationsFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('');
  
  // Storage states with reactive sync
  const [payments, setPayments] = useState(() => db.getPayments());
  const [campaigns, setCampaigns] = useState(() => db.getCampaigns());
  const [users, setUsers] = useState(() => db.getUsers());
  const [settings, setSettings] = useState(() => db.getAdminSettings());
  const [ads, setAds] = useState(() => db.getAds());
  const [withdrawalsList, setWithdrawalsList] = useState(() => db.getWithdrawals());
  const [verificationsList, setVerificationsList] = useState(() => db.getVerifications());

  const refreshAdminData = () => {
    setPayments(db.getPayments());
    setCampaigns(db.getCampaigns());
    setUsers(db.getUsers());
    setSettings(db.getAdminSettings());
    setAds(db.getAds());
    setWithdrawalsList(db.getWithdrawals());
    setVerificationsList(db.getVerifications());
  };

  useEffect(() => {
    refreshAdminData();
    const interval = setInterval(refreshAdminData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Settings Edit form states
  const [btc, setBtc] = useState(settings.btcAddress);
  const [eth, setEth] = useState(settings.ethAddress);
  const [doge, setDoge] = useState(settings.dogeAddress);
  const [trx, setTrx] = useState(settings.trxAddress);
  const [usdt, setUsdt] = useState(settings.usdtAddress);
  const [vodafone, setVodafone] = useState(settings.vodafoneCash || '');
  const [etisalat, setEtisalat] = useState(settings.etisalatCash || '');
  const [orange, setOrange] = useState(settings.orangeCash || '');
  const [we, setWe] = useState(settings.weCash || '');
  const [insta, setInsta] = useState(settings.instapay || '');
  const [supportEmailState, setSupportEmailState] = useState(settings.supportEmail || 'support@socialxchange.com');
  const [facebookPageUrlState, setFacebookPageUrlState] = useState(settings.facebookPageUrl || 'https://facebook.com/SocialXchange');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // New Ad form states
  const [adTitle, setAdTitle] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adPosition, setAdPosition] = useState<'header' | 'sidebar' | 'footer'>('header');
  const [adMessage, setAdMessage] = useState<string | null>(null);

  // User details balance adjust
  const [adjustingUser, setAdjustingUser] = useState<string | null>(null);
  const [pointsDelta, setPointsDelta] = useState<number>(1000);

  // Campaign control & customization states
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [editingPoints, setEditingPoints] = useState<number>(50);
  const [editingReward, setEditingReward] = useState<number>(40);
  const [editingFields, setEditingFields] = useState<{ id: string; label: string; value: string }[]>([]);
  const [newAdminFieldName, setNewAdminFieldName] = useState('');

  // Points configuration and custom platforms management states
  const [editingBuiltInType, setEditingBuiltInType] = useState<string | null>(null);
  const [pointsCostInput, setPointsCostInput] = useState<number>(50);
  const [visitorRewardInput, setVisitorRewardInput] = useState<number>(40);

  const [isAddingPlat, setIsAddingPlat] = useState(false);
  const [newPlatName, setNewPlatName] = useState('');
  const [newPlatPoints, setNewPlatPoints] = useState<number>(50);
  const [newPlatReward, setNewPlatReward] = useState<number>(40);
  const [newPlatUrlLabel, setNewPlatUrlLabel] = useState('');
  const [newPlatUrlPlaceholder, setNewPlatUrlPlaceholder] = useState('');
  const [newPlatTitlePlaceholder, setNewPlatTitlePlaceholder] = useState('');

  const [customFieldsInput, setCustomFieldsInput] = useState<{ id: string; label: string; type: 'text' | 'number' | 'textarea' }[]>([]);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [newCustomFieldType, setNewCustomFieldType] = useState<'text' | 'number' | 'textarea'>('text');

  // Dynamic Social Account Linking States
  const [editingSocialPlatId, setEditingSocialPlatId] = useState<string | null>(null);
  const [socialNameInput, setSocialNameInput] = useState('');
  const [socialDescInput, setSocialDescInput] = useState('');
  const [socialPlaceInput, setSocialPlaceInput] = useState('');
  const [socialIconInput, setSocialIconInput] = useState('');
  const [socialActiveInput, setSocialActiveInput] = useState(true);

  // Add new social plat states
  const [isAddingSocialPlat, setIsAddingSocialPlat] = useState(false);
  const [newSocialId, setNewSocialId] = useState('');
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialDesc, setNewSocialDesc] = useState('');
  const [newSocialPlace, setNewSocialPlace] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('Link2');

  // Dynamic Support Platform States
  const [supportPlats, setSupportPlats] = useState(settings.supportPlatforms || [
    { id: 'facebook', name: 'صفحة الفيس بوك الرسمية', url: settings.facebookPageUrl || 'https://facebook.com/SocialXchange', icon: 'Facebook', isActive: true },
    { id: 'support_email', name: 'البريد الإلكتروني للدعم الفني', url: `mailto:${settings.supportEmail || 'support@socialxchange.com'}`, icon: 'Mail', isActive: true }
  ]);
  const [editingSupportId, setEditingSupportId] = useState<string | null>(null);
  const [supportNameInput, setSupportNameInput] = useState('');
  const [supportUrlInput, setSupportUrlInput] = useState('');
  const [supportIconInput, setSupportIconInput] = useState('Link2');
  const [supportActiveInput, setSupportActiveInput] = useState(true);

  const [isAddingSupportPlat, setIsAddingSupportPlat] = useState(false);
  const [newSupportId, setNewSupportId] = useState('');
  const [newSupportName, setNewSupportName] = useState('');
  const [newSupportUrl, setNewSupportUrl] = useState('');
  const [newSupportIcon, setNewSupportIcon] = useState('Link2');

  // Point Exchange Rates Tiers states
  const [exchangeRates, setExchangeRates] = useState(settings.exchangeRates || [
    { points: 50000, dollars: 1, label: 'مستوى برونزي' },
    { points: 100000, dollars: 2, label: 'مستوى فضي' },
    { points: 150000, dollars: 4, label: '🔥 مستوى ذهبي (مكافأة +$1)' },
    { points: 200000, dollars: 6, label: '💎 بطل المنصة (مكافأة +$2)' }
  ]);
  const [editingRateIndex, setEditingRateIndex] = useState<number | null>(null);
  const [ratePointsInput, setRatePointsInput] = useState<number>(50000);
  const [rateDollarsInput, setRateDollarsInput] = useState<number>(1);
  const [rateLabelInput, setRateLabelInput] = useState('');

  const [isAddingRate, setIsAddingRate] = useState(false);
  const [newRatePoints, setNewRatePoints] = useState<number>(50000);
  const [newRateDollars, setNewRateDollars] = useState<number>(1);
  const [newRateLabel, setNewRateLabel] = useState('');

  // States for Admin Task Creation for custom platforms
  const [taskPlatform, setTaskPlatform] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskUrl, setTaskUrl] = useState('');
  const [taskQuantity, setTaskQuantity] = useState<number>(50);
  const [taskPointsPerAction, setTaskPointsPerAction] = useState<number>(50);
  const [taskRewardPerAction, setTaskRewardPerAction] = useState<number>(40);
  const [taskCustomFieldName1, setTaskCustomFieldName1] = useState('');
  const [taskCustomFieldValue1, setTaskCustomFieldValue1] = useState('');
  const [taskType, setTaskType] = useState<'subscription' | 'view' | 'like' | 'follow' | 'other'>('subscription');
  const [taskFeatured, setTaskFeatured] = useState<boolean>(false);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState<string | null>(null);

  // States for inline editing custom platform tasks
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingTaskUrl, setEditingTaskUrl] = useState('');
  const [editingTaskQuantity, setEditingTaskQuantity] = useState<number>(50);
  const [editingTaskPoints, setEditingTaskPoints] = useState<number>(50);
  const [editingTaskReward, setEditingTaskReward] = useState<number>(40);
  const [editingTaskType, setEditingTaskType] = useState<'subscription' | 'view' | 'like' | 'follow' | 'other'>('subscription');
  const [editingTaskFeatured, setEditingTaskFeatured] = useState<boolean>(false);

  // Dynamic Pricing Packages states
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageNameInput, setPackageNameInput] = useState('');
  const [packagePointsInput, setPackagePointsInput] = useState<number>(30000);
  const [packagePriceInput, setPackagePriceInput] = useState<number>(5);
  const [packageDescInputState, setPackageDescInputState] = useState('');
  
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [newPackageId, setNewPackageId] = useState('');
  const [newPackageName, setNewPackageName] = useState('');
  const [newPackagePoints, setNewPackagePoints] = useState<number>(30000);
  const [newPackagePrice, setNewPackagePrice] = useState<number>(5);
  const [newPackageDesc, setNewPackageDesc] = useState('');

  // Set default platform for task creation
  React.useEffect(() => {
    if (settings.customPlatforms && settings.customPlatforms.length > 0 && !taskPlatform) {
      setTaskPlatform(settings.customPlatforms[0].id);
      setTaskPointsPerAction(settings.customPlatforms[0].pointsPerAction || 50);
      setTaskRewardPerAction(settings.customPlatforms[0].rewardPerAction || 40);
    }
  }, [settings.customPlatforms, taskPlatform]);

  const handleCreateAdminTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskPlatform) {
      alert('الرجاء اختيار المنصة المضافة أولاً!');
      return;
    }
    if (!taskTitle.trim() || !taskUrl.trim()) {
      alert('الرجاء تعبئة العنوان والرابط!');
      return;
    }

    const payload = {
      type: taskPlatform,
      title: taskTitle.trim(),
      youtubeUrl: taskUrl.trim(),
      youtubeId: '',
      duration: 60,
      pointsPerAction: Number(taskPointsPerAction),
      rewardPerAction: Number(taskRewardPerAction),
      quantity: Number(taskQuantity),
      customFields: taskCustomFieldName1.trim() ? [{ id: 'field_1', label: taskCustomFieldName1.trim(), value: taskCustomFieldValue1.trim() }] : [],
      taskType: taskType,
      isFeatured: taskFeatured
    };

    const newCamp = db.addAdminCampaign(payload);
    if (newCamp && newCamp.id) {
      setTaskSuccessMsg(`🎉 تم بنجاح إنشاء وإطلاق مهمة رعاية للمنصة! معرف المهمة: ${newCamp.id}`);
      setTaskTitle('');
      setTaskUrl('');
      setTaskQuantity(50);
      setTaskCustomFieldName1('');
      setTaskCustomFieldValue1('');
      setTaskFeatured(false);
      setTimeout(() => setTaskSuccessMsg(null), 5000);
      // Trigger update
      if (typeof onAdminActionDone === 'function') {
        onAdminActionDone();
      }
    } else {
      alert('حدث خطأ أثناء حفظ المهمة المضافة.');
    }
  };

  const handleStartEditingTaskCampaign = (camp: Campaign) => {
    setEditingTaskId(camp.id);
    setEditingTaskTitle(camp.title);
    setEditingTaskUrl(camp.youtubeUrl);
    setEditingTaskQuantity(camp.quantity);
    setEditingTaskPoints(camp.pointsPerAction);
    setEditingTaskReward(camp.rewardPerAction || Math.round(camp.pointsPerAction * 0.8));
    setEditingTaskType(camp.taskType || 'subscription');
    setEditingTaskFeatured(!!camp.isFeatured);
  };

  const handleSaveEditedTaskCampaign = (campId: string) => {
    const campaignsList = db.getCampaigns();
    const camp = campaignsList.find(c => c.id === campId);
    if (!camp) return;

    const updatedCamp: Campaign = {
      ...camp,
      title: editingTaskTitle.trim(),
      youtubeUrl: editingTaskUrl.trim(),
      quantity: Number(editingTaskQuantity),
      pointsPerAction: Number(editingTaskPoints),
      rewardPerAction: Number(editingTaskReward),
      taskType: editingTaskType,
      isFeatured: editingTaskFeatured
    };

    const done = db.updateCampaign(updatedCamp);
    if (done) {
      setEditingTaskId(null);
      setTaskSuccessMsg('✅ تم حفظ تعديلات المهمة الترويجية وتحديثها بنجاح!');
      setTimeout(() => setTaskSuccessMsg(null), 4000);
      if (typeof onAdminActionDone === 'function') {
        onAdminActionDone();
      }
    } else {
      alert('فشل حفظ تعديلات المهمة.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userIn = usernameInput.trim().toLowerCase();
    if (
      (userIn === 'thelegendgamer2022@gmail.com' || userIn === 'bedogemy20144@gmail.com' || userIn === 'admin') &&
      passwordInput === '123BEDOgemy!@fx'
    ) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session_auth', 'true');
      setLoginError(null);
    } else {
      setLoginError('❌ البريد الإلكتروني أو كلمة المرور التي أدخلتها غير صحيحة!');
    }
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adImageUrl.trim() || !adTargetUrl.trim()) {
      setAdMessage('❌ يرجى ملء جميع الحقول المطلوبة!');
      return;
    }

    let widthClass = 'max-w-[728px]';
    let heightClass = 'h-[90px]';

    if (adPosition === 'sidebar') {
      widthClass = 'max-w-full';
      heightClass = 'h-[250px]';
    }

    db.addAdminAd({
      title: adTitle.trim(),
      imageUrl: adImageUrl.trim(),
      targetUrl: adTargetUrl.trim(),
      position: adPosition,
      widthClass,
      heightClass
    });

    setAdTitle('');
    setAdImageUrl('');
    setAdTargetUrl('');
    setAdMessage('✅ تم إضافة الإعلان والمساحة الإعلانية بنجاح بموقع التبادل!');
    
    setTimeout(() => {
      setAdMessage(null);
      onAdminActionDone();
    }, 2000);
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const ok = db.deleteAdminAd(id);
      if (ok) {
        onAdminActionDone();
      }
    }
  };

  const handleUpdateBuiltInConfig = (typeKey: string, pts: number, rwd: number) => {
    const s = db.getAdminSettings();
    s.pointsPerActionConfig = s.pointsPerActionConfig || {};
    s.pointsPerActionConfig[typeKey] = { pointsPerAction: pts, rewardPerAction: rwd };
    db.saveAdminSettings(s);
    setEditingBuiltInType(null);
    setSettingsMessage('✅ تم تحديث إعدادات نقاط التفاعل بنجاح وبشكل فوري!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const handleAddCustomPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatName.trim() || !newPlatUrlLabel.trim()) {
      alert('الرجاء إدخال اسم المنصة ووسم الرابط!');
      return;
    }
    const cleanId = 'custom_' + Date.now().toString(36);
    const s = db.getAdminSettings();
    s.customPlatforms = s.customPlatforms || [];
    
    s.customPlatforms.push({
      id: cleanId,
      name: newPlatName.trim(),
      pointsPerAction: Number(newPlatPoints),
      rewardPerAction: Number(newPlatReward),
      urlLabel: newPlatUrlLabel.trim(),
      urlPlaceholder: newPlatUrlPlaceholder.trim() || 'https://...',
      titlePlaceholder: newPlatTitlePlaceholder.trim() || 'اسم القناة/الحساب'
    });

    s.pointsPerActionConfig = s.pointsPerActionConfig || {};
    s.pointsPerActionConfig[cleanId] = { pointsPerAction: Number(newPlatPoints), rewardPerAction: Number(newPlatReward) };

    db.saveAdminSettings(s);

    // Reset states
    setNewPlatName('');
    setNewPlatPoints(50);
    setNewPlatReward(40);
    setNewPlatUrlLabel('');
    setNewPlatUrlPlaceholder('');
    setNewPlatTitlePlaceholder('');
    setIsAddingPlat(false);

    setSettingsMessage('✅ تم إضافة المنصة الرقمية الجديدة وحفظ تفاعلاتها بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const handleDeleteCustomPlatform = (platId: string) => {
    if (window.confirm('هل أنت متأكد من إلغاء وحذف هذه المنصة المخصصة؟ سيتم إخفاؤها من قوائم الإطلاق وقنوات التفاعل فوراً.')) {
      const s = db.getAdminSettings();
      s.customPlatforms = (s.customPlatforms || []).filter(p => p.id !== platId);
      if (s.pointsPerActionConfig) {
        delete s.pointsPerActionConfig[platId];
      }
      db.saveAdminSettings(s);
      setSettingsMessage('✅ تم حذف المنصة المخصصة وتنظيف إعداداتها!');
      onAdminActionDone();
      setTimeout(() => setSettingsMessage(null), 3000);
    }
  };

  const handleToggleSocialPlat = (platId: string) => {
    const s = db.getAdminSettings();
    s.socialLinkPlatforms = s.socialLinkPlatforms || [
      { id: 'youtube', name: 'يوتيوب (YouTube API)', desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.', place: '@username أو رابط القناة المفتوحة للتبادل', icon: 'Youtube', isActive: true },
      { id: 'facebook', name: 'فيسبوك (Facebook Sync)', desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.', place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي', icon: 'Facebook', isActive: true },
      { id: 'instagram', name: 'انستغرام (Instagram Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.', place: '@username أو رابط البروفايل', icon: 'Instagram', isActive: true },
      { id: 'tiktok', name: 'تيك توك (TikTok Verifier)', desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.', place: '@username الخاص بالتيك توك الخاص بك', icon: 'Flame', isActive: true },
      { id: 'x', name: 'إكس / تويتر (X / Twitter Portal)', desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.', place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)', icon: 'Compass', isActive: true },
      { id: 'pinterest', name: 'بنترست (Pinterest Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.', place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)', icon: 'Pin', isActive: true },
      { id: 'telegram', name: 'تليجرام (Telegram Sync)', desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.', place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)', icon: 'Send', isActive: true }
    ];
    s.socialLinkPlatforms = s.socialLinkPlatforms.map(p => {
      if (p.id === platId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    db.saveAdminSettings(s);
    setSettingsMessage('✅ تم تحديث حالة تفعيل المنصة بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleSaveSocialPlatEdit = (platId: string) => {
    const s = db.getAdminSettings();
    s.socialLinkPlatforms = s.socialLinkPlatforms || [
      { id: 'youtube', name: 'يوتيوب (YouTube API)', desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.', place: '@username أو رابط القناة المفتوحة للتبادل', icon: 'Youtube', isActive: true },
      { id: 'facebook', name: 'فيسبوك (Facebook Sync)', desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.', place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي', icon: 'Facebook', isActive: true },
      { id: 'instagram', name: 'انستغرام (Instagram Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.', place: '@username أو رابط البروفايل', icon: 'Instagram', isActive: true },
      { id: 'tiktok', name: 'تيك توك (TikTok Verifier)', desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.', place: '@username الخاص بالتيك توك الخاص بك', icon: 'Flame', isActive: true },
      { id: 'x', name: 'إكس / تويتر (X / Twitter Portal)', desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.', place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)', icon: 'Compass', isActive: true },
      { id: 'pinterest', name: 'بنترست (Pinterest Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.', place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)', icon: 'Pin', isActive: true },
      { id: 'telegram', name: 'تليجرام (Telegram Sync)', desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.', place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)', icon: 'Send', isActive: true }
    ];
    s.socialLinkPlatforms = s.socialLinkPlatforms.map(p => {
      if (p.id === platId) {
        return {
          ...p,
          name: socialNameInput.trim(),
          desc: socialDescInput.trim(),
          place: socialPlaceInput.trim(),
          icon: socialIconInput,
          isActive: socialActiveInput
        };
      }
      return p;
    });
    db.saveAdminSettings(s);
    setEditingSocialPlatId(null);
    setSettingsMessage('✅ تم حفظ تعديلات منصة التوثيق والربط بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleAddSocialLinkPlat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialId.trim() || !newSocialName.trim()) {
      alert('الرجاء تعبئة معرف المنصة واسمها!');
      return;
    }
    const s = db.getAdminSettings();
    s.socialLinkPlatforms = s.socialLinkPlatforms || [
      { id: 'youtube', name: 'يوتيوب (YouTube API)', desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.', place: '@username أو رابط القناة المفتوحة للتبادل', icon: 'Youtube', isActive: true },
      { id: 'facebook', name: 'فيسبوك (Facebook Sync)', desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.', place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي', icon: 'Facebook', isActive: true },
      { id: 'instagram', name: 'انستغرام (Instagram Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.', place: '@username أو رابط البروفايل', icon: 'Instagram', isActive: true },
      { id: 'tiktok', name: 'تيك توك (TikTok Verifier)', desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.', place: '@username الخاص بالتيك توك الخاص بك', icon: 'Flame', isActive: true },
      { id: 'x', name: 'إكس / تويتر (X / Twitter Portal)', desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.', place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)', icon: 'Compass', isActive: true },
      { id: 'pinterest', name: 'بنترست (Pinterest Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.', place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)', icon: 'Pin', isActive: true },
      { id: 'telegram', name: 'تليجرام (Telegram Sync)', desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.', place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)', icon: 'Send', isActive: true }
    ];
    
    const cleanId = newSocialId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (s.socialLinkPlatforms.some(p => p.id === cleanId)) {
      alert('معرف هذه المنصة مضاف بالفعل!');
      return;
    }

    s.socialLinkPlatforms.push({
      id: cleanId,
      name: newSocialName.trim(),
      desc: newSocialDesc.trim() || 'لا يوجد وصف للمنصة.',
      place: newSocialPlace.trim() || '@username',
      icon: newSocialIcon,
      isActive: true
    });
    
    db.saveAdminSettings(s);
    setIsAddingSocialPlat(false);
    setNewSocialId('');
    setNewSocialName('');
    setNewSocialDesc('');
    setNewSocialPlace('');
    setNewSocialIcon('Link2');
    setSettingsMessage('✅ تم تزويد وإضافة منصة ربط ومصادقة مطورة جديدة لمجتمع الأعضاء!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleDeleteSocialPlat = (platId: string) => {
    if (window.confirm('هل أنت متأكد من حذف وإزالة منصة الربط هذه بالكامل؟ لن يتمكن المشتركون الجدد من ربطها.')) {
      const s = db.getAdminSettings();
      s.socialLinkPlatforms = s.socialLinkPlatforms || [
        { id: 'youtube', name: 'يوتيوب (YouTube API)', desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.', place: '@username أو رابط القناة المفتوحة للتبادل', icon: 'Youtube', isActive: true },
        { id: 'facebook', name: 'فيسبوك (Facebook Sync)', desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.', place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي', icon: 'Facebook', isActive: true },
        { id: 'instagram', name: 'انستغرام (Instagram Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.', place: '@username أو رابط البروفايل', icon: 'Instagram', isActive: true },
        { id: 'tiktok', name: 'تيك توك (TikTok Verifier)', desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.', place: '@username الخاص بالتيك توك الخاص بك', icon: 'Flame', isActive: true },
        { id: 'x', name: 'إكس / تويتر (X / Twitter Portal)', desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.', place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)', icon: 'Compass', isActive: true },
        { id: 'pinterest', name: 'بنترست (Pinterest Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.', place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)', icon: 'Pin', isActive: true },
        { id: 'telegram', name: 'تليجرام (Telegram Sync)', desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.', place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)', icon: 'Send', isActive: true }
      ];
      s.socialLinkPlatforms = s.socialLinkPlatforms.filter(p => p.id !== platId);
      db.saveAdminSettings(s);
      setSettingsMessage('✅ تم حذف منصة الربط بنجاح!');
      onAdminActionDone();
      setTimeout(() => setSettingsMessage(null), 3500);
    }
  };

  // --- Dynamic Support Platform Handlers ---
  const handleToggleSupportPlat = (platId: string) => {
    const s = db.getAdminSettings();
    s.supportPlatforms = s.supportPlatforms || [
      { id: 'facebook', name: 'صفحة الفيس بوك الرسمية', url: s.facebookPageUrl || 'https://facebook.com/SocialXchange', icon: 'Facebook', isActive: true },
      { id: 'support_email', name: 'البريد الإلكتروني للدعم الفني', url: `mailto:${s.supportEmail || 'support@socialxchange.com'}`, icon: 'Mail', isActive: true }
    ];
    s.supportPlatforms = s.supportPlatforms.map(p => {
      if (p.id === platId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    db.saveAdminSettings(s);
    setSupportPlats(s.supportPlatforms);
    setSettingsMessage('✅ تم تحديث حالة تفعيل منصة الدعم الفني بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleSaveSupportPlatEdit = (platId: string) => {
    const s = db.getAdminSettings();
    s.supportPlatforms = s.supportPlatforms || [
      { id: 'facebook', name: 'صفحة الفيس بوك الرسمية', url: s.facebookPageUrl || 'https://facebook.com/SocialXchange', icon: 'Facebook', isActive: true },
      { id: 'support_email', name: 'البريد الإلكتروني للدعم الفني', url: `mailto:${s.supportEmail || 'support@socialxchange.com'}`, icon: 'Mail', isActive: true }
    ];
    s.supportPlatforms = s.supportPlatforms.map(p => {
      if (p.id === platId) {
        return {
          ...p,
          name: supportNameInput.trim(),
          url: supportUrlInput.trim(),
          icon: supportIconInput,
          isActive: supportActiveInput
        };
      }
      return p;
    });
    db.saveAdminSettings(s);
    setSupportPlats(s.supportPlatforms);
    setEditingSupportId(null);
    setSettingsMessage('✅ تم حفظ تعديلات منصة الدعم بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleAddSupportPlat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupportId.trim() || !newSupportName.trim() || !newSupportUrl.trim()) {
      alert('الرجاء تعبئة معرف المنصة واسمها ورابط التواصل الخاص بها!');
      return;
    }
    const s = db.getAdminSettings();
    s.supportPlatforms = s.supportPlatforms || [
      { id: 'facebook', name: 'صفحة الفيس بوك الرسمية', url: s.facebookPageUrl || 'https://facebook.com/SocialXchange', icon: 'Facebook', isActive: true },
      { id: 'support_email', name: 'البريد الإلكتروني للدعم الفني', url: `mailto:${s.supportEmail || 'support@socialxchange.com'}`, icon: 'Mail', isActive: true }
    ];
    
    const cleanId = newSupportId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (s.supportPlatforms.some(p => p.id === cleanId)) {
      alert('معرف هذه المنصة مضاف مسبقاً في الدعم!');
      return;
    }

    s.supportPlatforms.push({
      id: cleanId,
      name: newSupportName.trim(),
      url: newSupportUrl.trim(),
      icon: newSupportIcon,
      isActive: true
    });
    
    db.saveAdminSettings(s);
    setSupportPlats(s.supportPlatforms);
    setIsAddingSupportPlat(false);
    setNewSupportId('');
    setNewSupportName('');
    setNewSupportUrl('');
    setNewSupportIcon('Link2');
    setSettingsMessage('✅ تم إضافة منصة أيقونة دعم فني مخصصة جديدة بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleDeleteSupportPlat = (platId: string) => {
    if (window.confirm('هل أنت متأكد من حذف منصة الدعم المحددة؟ لن تظهر للعملاء بعد الآن.')) {
      const s = db.getAdminSettings();
      s.supportPlatforms = s.supportPlatforms || [
        { id: 'facebook', name: 'صفحة الفيس بوك الرسمية', url: s.facebookPageUrl || 'https://facebook.com/SocialXchange', icon: 'Facebook', isActive: true },
        { id: 'support_email', name: 'البريد الإلكتروني للدعم الفني', url: `mailto:${s.supportEmail || 'support@socialxchange.com'}`, icon: 'Mail', isActive: true }
      ];
      s.supportPlatforms = s.supportPlatforms.filter(p => p.id !== platId);
      db.saveAdminSettings(s);
      setSupportPlats(s.supportPlatforms);
      setSettingsMessage('✅ تم حذف منصة الدعم ورمز الاتصال بنجاح!');
      onAdminActionDone();
      setTimeout(() => setSettingsMessage(null), 3500);
    }
  };

  // --- Point Exchange Rates Tiers Handlers ---
  const handleSaveRateEdit = (index: number) => {
    const s = db.getAdminSettings();
    s.exchangeRates = s.exchangeRates || [
      { points: 50000, dollars: 1, label: 'مستوى برونزي' },
      { points: 100000, dollars: 2, label: 'مستوى فضي' },
      { points: 150000, dollars: 4, label: '🔥 مستوى ذهبي (مكافأة +$1)' },
      { points: 200000, dollars: 6, label: '💎 بطل المنصة (مكافأة +$2)' }
    ];
    s.exchangeRates[index] = {
      points: Number(ratePointsInput),
      dollars: Number(rateDollarsInput),
      label: rateLabelInput.trim() || s.exchangeRates[index]?.label || 'فئة استبدال'
    };
    db.saveAdminSettings(s);
    setExchangeRates(s.exchangeRates);
    setEditingRateIndex(null);
    setSettingsMessage('✅ تم حفظ وتعديل فئة استبدال النقاط بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleAddExchangeRate = (e: React.FormEvent) => {
    e.preventDefault();
    const s = db.getAdminSettings();
    s.exchangeRates = s.exchangeRates || [
      { points: 50000, dollars: 1, label: 'مستوى برونزي' },
      { points: 100000, dollars: 2, label: 'مستوى فضي' },
      { points: 150000, dollars: 4, label: '🔥 مستوى ذهبي (مكافأة +$1)' },
      { points: 200000, dollars: 6, label: '💎 بطل المنصة (مكافأة +$2)' }
    ];
    s.exchangeRates.push({
      points: Number(newRatePoints),
      dollars: Number(newRateDollars),
      label: newRateLabel.trim() || `مستوى استبدال جديد`
    });
    db.saveAdminSettings(s);
    setExchangeRates(s.exchangeRates);
    setIsAddingRate(false);
    setNewRatePoints(50000);
    setNewRateDollars(1);
    setNewRateLabel('');
    setSettingsMessage('✅ تم إضافة مستوى استبدال نقاط كاش جديد بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3500);
  };

  const handleDeleteExchangeRate = (index: number) => {
    if (window.confirm('هل أنت متأكد من حذف فئة استبدال النقاط هذه؟')) {
      const s = db.getAdminSettings();
      s.exchangeRates = s.exchangeRates || [
        { points: 50000, dollars: 1, label: 'مستوى برونزي' },
        { points: 100000, dollars: 2, label: 'مستوى فضي' },
        { points: 150000, dollars: 4, label: '🔥 مستوى ذهبي (مكافأة +$1)' },
        { points: 200000, dollars: 6, label: '💎 بطل المنصة (مكافأة +$2)' }
      ];
      s.exchangeRates = s.exchangeRates.filter((_, i) => i !== index);
      db.saveAdminSettings(s);
      setExchangeRates(s.exchangeRates);
      setSettingsMessage('✅ تم حذف مستوى استبدال النقاط بنجاح!');
      onAdminActionDone();
      setTimeout(() => setSettingsMessage(null), 3500);
    }
  };

  // Pricing Packages Handlers
  const handleAddPricingPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackageId.trim() || !newPackageName.trim()) {
      alert('الرجاء إدخال معرّف واسم الباقة!');
      return;
    }
    const s = db.getAdminSettings();
    s.purchasePackages = s.purchasePackages || [
      { id: 'pack1', name: 'الباقة البرونزية', points: 30000, price: 5, desc: 'الباقة البرونزية الافتراضية للبداية' },
      { id: 'pack2', name: 'الباقة الفضية', points: 50000, price: 7, desc: 'الباقة الفضية الأكثر تداولاً' },
      { id: 'pack3', name: 'الباقة الذهبية', points: 100000, price: 10, desc: 'الباقة الذهبية للمحترفين والمروجين' },
      { id: 'pack4', name: 'الباقة الخارقة', points: 150000, price: 15, desc: 'الباقة الخارقة للخصم والتوفير المميز' },
      { id: 'pack5', name: 'الباقة العملاقة', points: 200000, price: 18, desc: 'الباقة العملاقة بأعلى زيادة ورعاية' },
      { id: 'pack6', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: 'الباقة الاحترافية لمسؤولي الحملات الضخمة' }
    ];

    const cleanId = newPackageId.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (s.purchasePackages.some(p => p.id === cleanId)) {
      alert('رقم أو معرّف هذه الباقة مضاف مسبقاً!');
      return;
    }

    s.purchasePackages.push({
      id: cleanId,
      name: newPackageName.trim(),
      points: Number(newPackagePoints),
      price: Number(newPackagePrice),
      desc: newPackageDesc.trim() || 'لا يوجد وصف مضاف حالياً.'
    });

    db.saveAdminSettings(s);
    setIsAddingPackage(false);
    setNewPackageId('');
    setNewPackageName('');
    setNewPackagePoints(30000);
    setNewPackagePrice(5);
    setNewPackageDesc('');
    setSettingsMessage('✅ تم إضافة باقة شراء نقاط جديدة بالمنصة بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const handleSavePackageEdit = (pkgId: string) => {
    const s = db.getAdminSettings();
    s.purchasePackages = s.purchasePackages || [
      { id: 'pack1', name: 'الباقة البرونزية', points: 30000, price: 5, desc: 'الباقة البرونزية الافتراضية للبداية' },
      { id: 'pack2', name: 'الباقة الفضية', points: 50000, price: 7, desc: 'الباقة الفضية الأكثر تداولاً' },
      { id: 'pack3', name: 'الباقة الذهبية', points: 100000, price: 10, desc: 'الباقة الذهبية للمحترفين والمروجين' },
      { id: 'pack4', name: 'الباقة الخارقة', points: 150000, price: 15, desc: 'الباقة الخارقة للخصم والتوفير المميز' },
      { id: 'pack5', name: 'الباقة العملاقة', points: 200000, price: 18, desc: 'الباقة العملاقة بأعلى زيادة ورعاية' },
      { id: 'pack6', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: 'الباقة الاحترافية لمسؤولي الحملات الضخمة' }
    ];

    s.purchasePackages = s.purchasePackages.map(p => {
      if (p.id === pkgId) {
        return {
          ...p,
          name: packageNameInput.trim(),
          points: Number(packagePointsInput),
          price: Number(packagePriceInput),
          desc: packageDescInputState.trim()
        };
      }
      return p;
    });

    db.saveAdminSettings(s);
    setEditingPackageId(null);
    setSettingsMessage('✅ تم تعديل باقة الشراء بنجاح!');
    onAdminActionDone();
    setTimeout(() => setSettingsMessage(null), 3000);
  };

  const handleDeletePackage = (pkgId: string) => {
    if (window.confirm('هل أنت متأكد من حذف وإلغاء هذه الباقة من عروض الشراء نهائياً؟')) {
      const s = db.getAdminSettings();
      s.purchasePackages = s.purchasePackages || [
        { id: 'pack1', name: 'الباقة البرونزية', points: 30000, price: 5, desc: 'الباقة البرونزية الافتراضية للبداية' },
        { id: 'pack2', name: 'الباقة الفضية', points: 50000, price: 7, desc: 'الباقة الفضية الأكثر تداولاً' },
        { id: 'pack3', name: 'الباقة الذهبية', points: 100000, price: 10, desc: 'الباقة الذهبية للمحترفين والمروجين' },
        { id: 'pack4', name: 'الباقة الخارقة', points: 150000, price: 15, desc: 'الباقة الخارقة للخصم والتوفير المميز' },
        { id: 'pack5', name: 'الباقة العملاقة', points: 200000, price: 18, desc: 'الباقة العملاقة بأعلى زيادة ورعاية' },
        { id: 'pack6', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: 'الباقة الاحترافية لمسؤولي الحملات الضخمة' }
      ];
      s.purchasePackages = s.purchasePackages.filter(p => p.id !== pkgId);
      db.saveAdminSettings(s);
      setSettingsMessage('✅ تم حذف باقة الشراء بنجاح!');
      onAdminActionDone();
      setTimeout(() => setSettingsMessage(null), 3000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const current = db.getAdminSettings();
    db.saveAdminSettings({
      ...current,
      btcAddress: btc.trim(),
      ethAddress: eth.trim(),
      dogeAddress: doge.trim(),
      trxAddress: trx.trim(),
      usdtAddress: usdt.trim(),
      vodafoneCash: vodafone.trim(),
      etisalatCash: etisalat.trim(),
      orangeCash: orange.trim(),
      weCash: we.trim(),
      instapay: insta.trim(),
      supportEmail: supportEmailState.trim(),
      facebookPageUrl: facebookPageUrlState.trim()
    });
    setSettingsMessage('✅ تم حفظ بوابات الدفع وتفاصيل تواصل الدعم بنجاح!');
    setTimeout(() => {
      setSettingsMessage(null);
      onAdminActionDone();
    }, 2500);
  };

  const handleApprovePayment = (id: string) => {
    const ok = db.approvePayment(id);
    if (ok) {
      onAdminActionDone();
    }
  };

  const handleRejectPayment = (id: string, reason?: string) => {
    const ok = db.rejectPayment(id, reason);
    if (ok) {
      onAdminActionDone();
    }
  };

  const handleApproveWithdrawal = (id: string) => {
    const ok = db.approveWithdrawal(id);
    if (ok) {
      onAdminActionDone();
    }
  };

  const handleRejectWithdrawal = (id: string) => {
    const ok = db.rejectWithdrawal(id);
    if (ok) {
      onAdminActionDone();
    }
  };

  const handleToggleCampaignStatus = (id: string) => {
    const ok = db.toggleCampaignStatus(id);
    if (ok) {
      onAdminActionDone();
    }
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('بعد المسح سيتم تعويض رصيد المعلم بنسبة الـ كميات المتبقية. هل أنت متأكد؟')) {
      const ok = db.deleteCampaign(id);
      if (ok) {
        onAdminActionDone();
      }
    }
  };

  const handleStartEditingCampaign = (camp: Campaign) => {
    setEditingCampaignId(camp.id);
    setEditingPoints(camp.pointsPerAction);
    setEditingReward(camp.rewardPerAction || Math.round(camp.pointsPerAction * 0.8));
    setEditingFields(camp.customFields || []);
    setNewAdminFieldName('');
  };

  const handleSaveCampaignEdits = (id: string) => {
    const campaignsList = db.getCampaigns();
    const camp = campaignsList.find(c => c.id === id);
    if (!camp) return;

    const updatedCamp: Campaign = {
      ...camp,
      pointsPerAction: editingPoints,
      rewardPerAction: editingReward,
      customFields: editingFields
    };

    const done = db.updateCampaign(updatedCamp);
    if (done) {
      setEditingCampaignId(null);
      onAdminActionDone();
    }
  };

  const handleAdjustPoints = (uid: string) => {
    if (!pointsDelta) return;
    db.updateUserPoints(uid, pointsDelta);
    setAdjustingUser(null);
    onAdminActionDone();
  };

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(usersFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(usersFilter.toLowerCase())
  );

  // ENCRYPTION LOCK GATEWAY - Require Credentials specified by user
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-right font-sans my-12">
        <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-slate-800/60 mb-6">
          <div className="w-16 h-16 bg-red-650/10 rounded-2xl flex items-center justify-center border border-red-500/25 text-red-500 mb-4 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-white">تسجيل دخول نظام الإدارة</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            هذه المنطقة مشفرة ومخصصة وحصرية لفريق العمل والتحكم العام بالموقع.
          </p>
        </div>

        {loginError && (
          <div className="p-3 mb-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center font-bold">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">البريد الإلكتروني الإداري</label>
            <input
              id="admin-login-username"
              type="text"
              required
              placeholder=""
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:border-red-500 text-xs text-left font-mono outline-none text-white focus:ring-1 focus:ring-red-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">كلمة المرور السرية</label>
            <input
              id="admin-login-password"
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:border-red-500 text-xs text-left font-mono outline-none text-white focus:ring-1 focus:ring-red-500 transition"
            />
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10 mt-2"
          >
            <span>فك تشفير الإدارة والولوج</span>
          </button>
        </form>

        <div className="mt-5 text-[10px] text-slate-500 text-center leading-relaxed">
          جميع محاولات الدخول الخاطئة يتم تتبعها بدقة للحفاظ على سلامة أرصدة الأعضاء.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-right font-sans max-w-6xl mx-auto">
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/10 rounded-3xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 flex-row-reverse">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-500 border border-red-500/20 mb-3 float-right md:float-none">
              مسؤول النظام الحصري
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">غرفة تحكم الإدارة الشاملة</h1>
            <p className="text-sm text-slate-400 mt-2">راقب المعاملات المالية، وافق على تحويلات الكريبتو، وقم بتعديل عناوين المحافظ الرقمية بكل أمان من شاشتك الكاملة.</p>
          </div>
          
          <button
            id="reset-db-btn"
            onClick={() => {
              if (window.confirm('هل تريد فعلاً إعادة ضبط قاعدة البيانات إلى وضع المصنع وتوليد بيانات تجريبية جديدة؟')) {
                db.resetDatabase();
                onAdminActionDone();
              }
            }}
            className="px-4 py-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 font-semibold text-xs rounded-xl border border-red-500/20 hover:border-red-600 transition cursor-pointer self-start md:self-center"
          >
            إعادة تعيين قاعدة البيانات للتجربة
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800 mb-6 font-bold overflow-x-auto gap-2">
        {[
          { id: 'verifications', label: 'توثيق المهمات (Screenshot)', icon: ShieldCheck, count: verificationsList.filter(v => v.status === 'pending').length },
          { id: 'payments', label: 'مراجعة المشتريات المعلقة', icon: Coins, count: payments.filter(p => p.status === 'pending').length },
          { id: 'withdrawals', label: 'مراجعة طلبات استبدال النقاط والسحب', icon: Wallet, count: withdrawalsList.filter(w => w.status === 'pending').length },
          { id: 'linking_config', label: 'إداراة ربط ومصادقة الحسابات (جديد 🛡️)', icon: ShieldCheck },
          { id: 'exchange_config', label: 'تعديل أسعار تبديل النقاط (جديد 💰)', icon: Coins },
          { id: 'pricing_packages_config', label: 'باقات شحن الرصيد (جديد 🏷️)', icon: Sparkles },
          { id: 'wallets', label: 'إعدادات المحافظ الرقمية', icon: Wallet },
          { id: 'campaigns', label: 'إدارة الحملات الإعلانية', icon: Link2, count: campaigns.length },
          { id: 'users', label: 'إدارة أرصدة الأعضاء', icon: Users, count: users.length },
          { id: 'points_config', label: 'تعديل نقاط وإدارة المنصات', icon: Sparkles },
          { id: 'custom_campaigns', label: 'مهام المنصات المضافة (جديد ⚡️)', icon: PlusCircle },
          { id: 'ads', label: 'إدارة المساحات الإعلانية والبنرات', icon: Megaphone, count: ads.length },
          { id: 'support', label: 'الشكاوى ومراجعة التعليقات', icon: MessageSquare, count: db.getComplaints().length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              id={`adm-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 text-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition ${
                adminTab === tab.id
                  ? 'border-red-500 text-red-500 font-black'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: LINKING_CONFIG */}
      {adminTab === 'linking_config' && (
        <div className="space-y-6 font-sans text-right" dir="rtl">
          {/* Main Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>التحكم في منصات ربط ومصادقة الحسابات المطور</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">تتيح لك هذه اللوحة تعديل منصات الربط والتحقق التلقائي الحالية أو تزويد وإضافة منصات وشبكات اجتماعية مخصصة وجديدة للمشتركين لربط حساباتهم عليها.</p>
              </div>

              {!isAddingSocialPlat && (
                <button
                  type="button"
                  onClick={() => setIsAddingSocialPlat(true)}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition self-start cursor-pointer shadow-lg hover:scale-105"
                >
                  تزويد منصة ربط ومصادقة جديدة +
                </button>
              )}
            </div>

            {settingsMessage && (
              <div className="p-3 mb-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl font-bold text-xs text-center animate-pulse">
                {settingsMessage}
              </div>
            )}

            {/* Form to Add Social Plat */}
            {isAddingSocialPlat && (
              <form onSubmit={handleAddSocialLinkPlat} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl mb-6 space-y-4">
                <h4 className="text-xs font-black text-indigo-400 flex items-center gap-1.5 pb-2 border-b border-slate-850">
                  <span>تزويد منصة ربط ومصادقة مطورة جديدة</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-350">معرف المنصة الفريد بالإنجليزية (ID - أحرف وأرقام وجملة واحدة):</label>
                    <input
                      type="text"
                      required
                      value={newSocialId}
                      onChange={(e) => setNewSocialId(e.target.value)}
                      placeholder="مثال: linkedin, snapchat, X_app"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-355 text-slate-350">اسم المنصة بالكامل (بروتوكول التحقق الآلي):</label>
                    <input
                      type="text"
                      required
                      value={newSocialName}
                      onChange={(e) => setNewSocialName(e.target.value)}
                      placeholder="مثال: سناب شات (Snapchat API)"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-350">وصف بروتوكول الأمان والربط:</label>
                    <textarea
                      required
                      value={newSocialDesc}
                      onChange={(e) => setNewSocialDesc(e.target.value)}
                      placeholder="مثال: للتحقق من إكمال القصص والاشتراكات في بضع ثوان برمجياً تلقائياً."
                      rows={2}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-350">تلميح إدخال المعرف (Placeholeder):</label>
                    <input
                      type="text"
                      required
                      value={newSocialPlace}
                      onChange={(e) => setNewSocialPlace(e.target.value)}
                      placeholder="مثال: @username أو رابط الحساب الخاص بك"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-350">أيقونة العرض (Icon):</label>
                    <select
                      value={newSocialIcon}
                      onChange={(e) => setNewSocialIcon(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl"
                    >
                      <option value="Link2">سلسلة ربط (Link2)</option>
                      <option value="Youtube">يوتيوب (Youtube)</option>
                      <option value="Facebook">فيسبوك (Facebook)</option>
                      <option value="Instagram">انستجرام (Instagram)</option>
                      <option value="Flame">لهب / تيك توك (Flame)</option>
                      <option value="Send">برق / تليجرام (Send)</option>
                      <option value="ShieldCheck">درع حماية (ShieldCheck)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-850 justify-end">
                  <button
                    type="submit"
                    className="py-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition"
                  >
                    🚀 زوّد وعمّم المنصة الآن
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingSocialPlat(false)}
                    className="py-2 px-4 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    تراجع / إلغاء
                  </button>
                </div>
              </form>
            )}

            {/* Existing platforms control list */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-300 pb-2 border-b border-slate-800/60">المنصات الحالية الموثقة داخل التطبيق:</h4>
              
              {(settings.socialLinkPlatforms || [
                { id: 'youtube', name: 'يوتيوب (YouTube API)', desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.', place: '@username أو رابط القناة المفتوحة للتبادل', icon: 'Youtube', isActive: true },
                { id: 'facebook', name: 'فيسبوك (Facebook Sync)', desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.', place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي', icon: 'Facebook', isActive: true },
                { id: 'instagram', name: 'انستغرام (Instagram Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.', place: '@username أو رابط البروفايل', icon: 'Instagram', isActive: true },
                { id: 'tiktok', name: 'تيك توك (TikTok Verifier)', desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.', place: '@username الخاص بالتيك توك الخاص بك', icon: 'Flame', isActive: true },
                { id: 'x', name: 'إكس / تويتر (X / Twitter Portal)', desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.', place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)', icon: 'Compass', isActive: true },
                { id: 'pinterest', name: 'بنترست (Pinterest Connect)', desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.', place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)', icon: 'Pin', isActive: true },
                { id: 'telegram', name: 'تليجرام (Telegram Sync)', desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.', place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)', icon: 'Send', isActive: true }
              ]).map((p) => {
                const isEditing = editingSocialPlatId === p.id;
                
                return (
                  <div key={p.id} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col space-y-4">
                    {isEditing ? (
                      /* Editing Interface */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-400">اسم المنصة:</label>
                            <input
                              type="text"
                              value={socialNameInput}
                              onChange={(e) => setSocialNameInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-400">تلميح الإدخال:</label>
                            <input
                              type="text"
                              value={socialPlaceInput}
                              onChange={(e) => setSocialPlaceInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-400">الوصف التفصيلي لمصادقة الأمان:</label>
                            <input
                              type="text"
                              value={socialDescInput}
                              onChange={(e) => setSocialDescInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[11px] font-bold text-slate-400">الأيقونة الممثلة للمنصة:</label>
                            <select
                              value={socialIconInput}
                              onChange={(e) => setSocialIconInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                            >
                              <option value="Link2">Link2</option>
                              <option value="Youtube">Youtube</option>
                              <option value="Facebook">Facebook</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Flame">Flame</option>
                              <option value="Send">Send</option>
                              <option value="ShieldCheck">ShieldCheck</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id={`edit-active-${p.id}`}
                              checked={socialActiveInput}
                              onChange={(e) => setSocialActiveInput(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 outline-none"
                            />
                            <label htmlFor={`edit-active-${p.id}`} className="text-xs font-bold text-slate-350">هل المنصة نشطة للتناول؟</label>
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-slate-900">
                          <button
                            type="button"
                            onClick={() => handleSaveSocialPlatEdit(p.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer transition"
                          >
                            ✓ حفظ التعديلات وحفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSocialPlatId(null)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white text-[10.5px] rounded-xl cursor-pointer"
                          >
                            إلغاء التراجع
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Read-only view for each platform */
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1 text-right">
                          <div className="flex items-center gap-2 flex-wrap justify-start flex-row-reverse">
                            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold px-2 py-0.5 rounded">ID: {p.id}</span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold ${
                              p.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                            }`}>
                              {p.isActive ? '✓ نشط ومتاح لربطه' : '✗ معطل مؤقتاً'}
                            </span>
                            <span className="text-sm font-black text-white">{p.name}</span>
                          </div>
                          
                          <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                          <p className="text-[11px] text-slate-500 leading-normal"><span className="text-indigo-400 font-bold">تلميح الإدخال:</span> {p.place}</p>
                          <p className="text-[10px] text-slate-650 font-mono">الأيقونة المستخدمة: {p.icon || 'Link2'}</p>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSocialPlatId(p.id);
                              setSocialNameInput(p.name);
                              setSocialDescInput(p.desc);
                              setSocialPlaceInput(p.place);
                              setSocialIconInput(p.icon || 'Link2');
                              setSocialActiveInput(p.isActive);
                            }}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 text-xs font-bold rounded-xl border border-slate-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleSocialPlat(p.id)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 ${
                              p.isActive 
                                ? 'bg-amber-500/10 hover:bg-amber-550 border border-amber-500/20 text-amber-500 hover:text-white' 
                                : 'bg-emerald-500/10 hover:bg-emerald-555 border border-emerald-500/20 text-emerald-500 hover:text-white'
                            }`}
                          >
                            {p.isActive ? 'تعطيل ⏸' : 'تفعيل ▶'}
                          </button>

                          {/* Allow deleting non-built-in ones, or confirm before deleting any */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSocialPlat(p.id)}
                            className="p-2 bg-red-650 bg-red-600/10 hover:bg-red-650 hover:text-white text-red-500 rounded-xl border border-red-500/20 hover:border-red-650 cursor-pointer transition"
                            title="حذف هذه المنصة بالكامل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXCHANGE RATES CONFIGURATION */}
      {adminTab === 'exchange_config' && (
        <div className="space-y-8 text-right font-sans animate-fade-in" dir="rtl">
          {/* Section Heading */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span>إعدادات تبديل النقاط وسحب الأرباح بالكامل 💰</span>
            </h3>
            <p className="text-xs text-slate-400">تحكم بالكامل بأسعار الصرف وفئات استبدال النقاط بالدولار ونسب المكافآت التي يحصل عليها المستخدمون عند تحويل ثروة النقاط إلى رصيد كاش جاهز للسحب.</p>

            {settingsMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl mt-4 text-xs font-bold leading-none flex items-center gap-2 animate-pulse">
                <Check className="w-4 h-4 shrink-0" />
                <span>{settingsMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Add Level Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h4 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <span>➕ إضافة مستوى / فئة تبديل نقاط جديدة</span>
            </h4>

            {!isAddingRate ? (
              <button
                type="button"
                onClick={() => setIsAddingRate(true)}
                className="py-2.5 px-5 bg-emerald-650 bg-emerald-650/90 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
              >
                إنشاء مستوى استبدال جديد
              </button>
            ) : (
              <form onSubmit={handleAddExchangeRate} className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400">اسم أو تسمية الفئة (مثلاً: المستوى البرونزي، المميز):</label>
                    <input
                      type="text"
                      required
                      placeholder="امثلة: مستوى فضي، 🔥 بطل المنصة"
                      value={newRateLabel}
                      onChange={(e) => setNewRateLabel(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400">النقاط المطلوبة من الأعضاء للاستبدال:</label>
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="مثال: 50000"
                      value={newRatePoints || ''}
                      onChange={(e) => setNewRatePoints(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-400">القيمة بالدولار الأمريكي (USD) المستلمة مقابلها:</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min={0.01}
                      placeholder="مثال: 1"
                      value={newRateDollars || ''}
                      onChange={(e) => setNewRateDollars(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setIsAddingRate(false)}
                    className="py-1.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold rounded-lg transition shrink-0"
                  >
                    إلغاء الحفظ
                  </button>
                  <button
                    type="submit"
                    className="py-1.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-lg transition"
                  >
                    إضافة الفئة الجديدة فوراً
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* List Of All Active Rates Configured */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h4 className="text-sm font-extrabold text-white mb-5 flex items-center gap-1.5">
              <span>📋 فئات استبدال النقاط النشطة المضبوطة حالياً</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(exchangeRates || []).map((element, idx) => {
                const isEditing = editingRateIndex === idx;
                return (
                  <div key={idx} className="bg-slate-950 p-5 border border-slate-850 rounded-2xl flex flex-col justify-between gap-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                          <span className="text-xs font-extrabold text-indigo-400">تعديل المستوى #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setEditingRateIndex(null)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            بطلان التعديل
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-450">تسمية المستوى / الفئة:</label>
                            <input
                              type="text"
                              value={rateLabelInput}
                              onChange={(e) => setRateLabelInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs text-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-450">النقاط المطلوبة:</label>
                              <input
                                type="number"
                                value={ratePointsInput}
                                onChange={(e) => setRatePointsInput(Number(e.target.value))}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-450">القيمة بالدولار USD:</label>
                              <input
                                type="number"
                                step="0.01"
                                value={rateDollarsInput}
                                onChange={(e) => setRateDollarsInput(Number(e.target.value))}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs font-mono text-white outline-none"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveRateEdit(idx)}
                            className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold rounded-lg text-xs transition cursor-pointer mt-2"
                          >
                            موافق وحفظ في الإعدادات
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5">
                            <span className="text-xs font-extrabold text-white bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-xl inline-block">{element.label}</span>
                            <div className="text-xs font-sans text-slate-400 mt-1">
                              النقاط المستهدفة للخصم: <strong className="text-white font-mono font-black">{(element.points).toLocaleString()}</strong> نقطة
                            </div>
                            <div className="text-xs font-sans text-slate-400">
                              رصيد الدولارات المضاف: <strong className="text-emerald-400 font-mono font-black">${element.dollars}</strong> USD
                            </div>
                            <div className="text-[10px] text-slate-550">
                              سعر صرف لكل 100K نقطة: <strong className="text-slate-400 font-mono">${((element.dollars / element.points) * 100000).toFixed(2)}</strong>
                            </div>
                          </div>

                          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-mono text-sm font-extrabold shrink-0 border border-emerald-500/20">
                            ${element.dollars}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-900 pt-3 justify-end font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRateIndex(idx);
                              setRateLabelInput(element.label);
                              setRatePointsInput(element.points);
                              setRateDollarsInput(element.dollars);
                            }}
                            className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                          >
                            🔧 تحرير تفاصيل الصرف
                          </button>
                          <span className="text-slate-800 font-mono">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteExchangeRate(idx)}
                            className="text-[11px] font-bold text-red-500 hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                          >
                            🗑️ إزالة الفئة
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRICING PACKAGES CONFIGURATION */}
      {adminTab === 'pricing_packages_config' && (
        <div className="space-y-8 text-right font-sans animate-fade-in" dir="rtl">
          {/* Section Heading */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>التحكم في باقات شحن ورصيد النقاط الترويجية (Pricing Packages Control) 🏷️</span>
            </h3>
            <p className="text-xs text-slate-400">تحكم بالكامل بأسعار البيع الخاصة بالنقاط، والسعة التراكمية لكل باقة، وأسماء المجموعات لتظهر مباشرة في نماذج شحن الرصيد والواجهة الرئيسية للمنصة.</p>

            {settingsMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl mt-4 text-xs font-bold leading-none flex items-center gap-2 animate-pulse">
                <Check className="w-4 h-4 shrink-0" />
                <span>{settingsMessage}</span>
              </div>
            )}
          </div>

          {/* Quick Add Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h4 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
              <span>➕ إنشاء وإدراج باقة شحن نقاط جديدة</span>
            </h4>

            {!isAddingPackage ? (
              <button
                id="btn-show-add-package"
                type="button"
                onClick={() => setIsAddingPackage(true)}
                className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer"
              >
                تفعيل نموذج إضافة باقة جديدة
              </button>
            ) : (
              <form onSubmit={handleAddPricingPackage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400">معرّف الباقة الفريد:</label>
                    <input
                      id="new-package-id"
                      type="text"
                      required
                      placeholder="e.g. pack_custom_1"
                      value={newPackageId}
                      onChange={(e) => setNewPackageId(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400">اسم الباقة الجذاب:</label>
                    <input
                      id="new-package-name"
                      type="text"
                      required
                      placeholder="e.g. باقة التوفير الفائقة"
                      value={newPackageName}
                      onChange={(e) => setNewPackageName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400">عدد النقاط الممنوح:</label>
                    <input
                      id="new-package-points"
                      type="number"
                      required
                      value={newPackagePoints}
                      onChange={(e) => setNewPackagePoints(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-400">السعر بالدولار ($):</label>
                    <input
                      id="new-package-price"
                      type="number"
                      required
                      step="0.01"
                      value={newPackagePrice}
                      onChange={(e) => setNewPackagePrice(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-400">وصف مختصر أو شعار تسويقي للباقة:</label>
                  <input
                    id="new-package-desc"
                    type="text"
                    required
                    placeholder="e.g. وفر 40% واحصل على أولوية ظهور قصوى لحملاتك"
                    value={newPackageDesc}
                    onChange={(e) => setNewPackageDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-white outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="btn-save-new-package"
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl cursor-pointer transition"
                  >
                    حفظ ونشر الباقة فوراً بالمنصة
                  </button>
                  <button
                    id="btn-cancel-new-package"
                    type="button"
                    onClick={() => setIsAddingPackage(false)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition"
                  >
                    تراجع
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Current Packages List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h4 className="text-sm font-extrabold text-white mb-6">
              📋 الباقات والعروض المفعلة حالياً ومواصفاتها كلياً بالمنصة
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(settings.purchasePackages && settings.purchasePackages.length > 0
                ? settings.purchasePackages
                : [
                    { id: 'pack1', name: 'الباقة البرونزية', points: 30000, price: 5, desc: 'الباقة البرونزية الافتراضية للبداية' },
                    { id: 'pack2', name: 'الباقة الفضية', points: 50000, price: 7, desc: 'الباقة الفضية الأكثر تداولاً' },
                    { id: 'pack3', name: 'الباقة الذهبية', points: 100000, price: 10, desc: 'الباقة الذهبية للمحترفين والمروجين' },
                    { id: 'pack4', name: 'الباقة الخارقة', points: 150000, price: 15, desc: 'الباقة الخارقة للخصم والتوفير المميز' },
                    { id: 'pack5', name: 'الباقة العملاقة', points: 200000, price: 18, desc: 'الباقة العملاقة بأعلى زيادة ورعاية' },
                    { id: 'pack6', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: 'الباقة الاحترافية لمسؤولي الحملات الضخمة' }
                  ]
              ).map((p) => {
                const isUnderEdit = editingPackageId === p.id;
                return (
                  <div key={p.id} className="bg-slate-950 border border-slate-850 hover:border-amber-500/20 rounded-2xl p-5 transition flex flex-col justify-between">
                    {isUnderEdit ? (
                      <div className="space-y-3.5">
                        <div className="text-[10px] text-amber-500 font-mono font-bold uppercase">
                          تعديل باقة: {p.id}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400">اسم الباقة:</label>
                          <input
                            type="text"
                            required
                            value={packageNameInput}
                            onChange={(e) => setPackageNameInput(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400">عدد النقاط الممنوح:</label>
                          <input
                            type="number"
                            required
                            value={packagePointsInput}
                            onChange={(e) => setPackagePointsInput(Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400">السعر بالدولار ($):</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={packagePriceInput}
                            onChange={(e) => setPackagePriceInput(Number(e.target.value))}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400">وصف الباقة الإعلاني:</label>
                          <textarea
                            required
                            rows={2}
                            value={packageDescInputState}
                            onChange={(e) => setPackageDescInputState(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-3 border-t border-slate-900">
                          <button
                            type="button"
                            onClick={() => handleSavePackageEdit(p.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] rounded-xl cursor-pointer transition"
                          >
                            حفظ الباقة
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPackageId(null)}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold text-[10.5px] rounded-xl cursor-pointer transition"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono select-none px-2 py-0.5 rounded-md bg-slate-900 text-slate-500 font-extrabold border border-slate-850">
                              ID: {p.id}
                            </span>
                            <span className="bg-amber-500/10 text-amber-500 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/20">
                              {p.points.toLocaleString()} نقطة
                            </span>
                          </div>

                          <h5 className="text-sm font-extrabold text-white mb-1.5">{p.name}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed min-h-8 mb-4">{p.desc}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                          <span className="text-lg font-black text-amber-400">
                            ${p.price.toFixed(2)}
                          </span>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPackageId(p.id);
                                setPackageNameInput(p.name);
                                setPackagePointsInput(p.points);
                                setPackagePriceInput(p.price);
                                setPackageDescInputState(p.desc);
                              }}
                              className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                            >
                              ✏️ تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePackage(p.id)}
                              className="text-[11px] font-bold text-red-500 hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                            >
                              🗑️ حذف
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VERIFICATIONS */}
      {adminTab === 'verifications' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md text-right font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>لوحة مراجعة وتوثيق المهمات المرفوعة (Screenshot Verification)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">تحقق يدوياً وبدقة من صور لقطات الشاشة المرفوعة من المشتركين للموافقة عليها أو رفضها.</p>
              </div>

              {/* Status Filter buttons */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 self-start sm:self-center">
                {[
                  { id: 'pending', label: 'قيد الانتظار ⏳' },
                  { id: 'approved', label: 'مقبولة ✓' },
                  { id: 'rejected', label: 'مرفوضة ✗' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setVerificationsFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      verificationsFilter === f.id
                        ? 'bg-red-650 bg-red-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label} ({verificationsList.filter(v => v.status === f.id).length})
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {verificationsList.filter(v => v.status === verificationsFilter).length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs bg-slate-950 border border-slate-800 rounded-2xl">
                لا توجد أي طلبات توثيق {verificationsFilter === 'pending' ? 'معلقة' : verificationsFilter === 'approved' ? 'مقبولة عموماً' : 'مرفوضة في الوقت الحالي'}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verificationsList
                  .filter(v => v.status === verificationsFilter)
                  .map((v: TaskVerification) => {
                    const getPlatformBadge = (type: string) => {
                      const tLow = (type || '').toLowerCase();
                      let icon = <Youtube className="w-3.5 h-3.5 text-red-550 text-red-500" />;
                      let name = 'مشاهدة يوتيوب';
                      let color = 'bg-red-500/10 border-red-500/20 text-red-400';

                      if (tLow.includes('fb_') || tLow.includes('facebook')) {
                        icon = <Facebook className="w-3.5 h-3.5 text-blue-500" />;
                        name = 'تفاعل فيسبوك';
                        color = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                      } else if (tLow.includes('ig_') || tLow.includes('instagram')) {
                        icon = <Instagram className="w-3.5 h-3.5 text-pink-550 text-pink-500" />;
                        name = 'تفاعل انستجرام';
                        color = 'bg-pink-500/10 border-pink-500/20 text-pink-400';
                      } else if (tLow.includes('tiktok_')) {
                        icon = <Flame className="w-3.5 h-3.5 text-amber-550 text-amber-550 text-amber-500" />;
                        name = 'تفاعل تيك توك';
                        color = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                      } else if (tLow.includes('tg_') || tLow.includes('telegram')) {
                        icon = <Send className="w-3.5 h-3.5 text-sky-450 text-sky-400" />;
                        name = 'انضمام تليجرام';
                        color = 'bg-sky-500/10 border-sky-500/20 text-sky-400';
                      } else if (tLow.includes('pinterest_')) {
                        icon = <Pin className="w-3.5 h-3.5 text-red-500" />;
                        name = 'لايك بنترست';
                        color = 'bg-red-500/10 border-red-500/20 text-red-400';
                      } else if (tLow.includes('x_') || tLow.includes('twitter')) {
                        icon = <Compass className="w-3.5 h-3.5 text-white" />;
                        name = 'تفاعل إكس (X)';
                        color = 'bg-slate-900 border-slate-700 text-white';
                      }

                      return (
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${color} font-bold text-[10px] w-fit`}>
                          {icon}
                          <span>{name}</span>
                        </div>
                      );
                    };

                    const findCampaignUrl = () => {
                      if (v.taskUrl && v.taskUrl.trim()) return v.taskUrl.trim();
                      
                      // Check in our reactive campaigns list
                      const matchedCamp = campaigns.find(c => c.id === v.campaignId || c.id === v.taskId);
                      if (matchedCamp && matchedCamp.youtubeUrl) return matchedCamp.youtubeUrl.trim();
                      
                      return '';
                    };
                    const rawUrl = findCampaignUrl();
                    const resolvedUrl = rawUrl.trim() ? (rawUrl.trim().startsWith('http://') || rawUrl.trim().startsWith('https://') ? rawUrl.trim() : `https://${rawUrl.trim()}`) : '';

                    return (
                      <div id={`ver-card-${v.id}`} key={v.id} className="bg-slate-950 border border-slate-850 p-5 rounded-3xl space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Top row */}
                          <div className="flex justify-between items-center gap-2 flex-row-reverse text-left">
                            <span className="text-[10px] text-slate-500 font-mono">ID: {v.id}</span>
                            <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[11px] px-2.5 py-1 rounded-xl">
                              💡 {v.rewardPoints} نقطة مكافأة
                            </div>
                          </div>

                          {/* Member/Task details structured in columns */}
                          <div className="space-y-3 text-right font-sans">
                            <div className="grid grid-cols-1 gap-2.5 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-900/70">
                              <div className="flex items-center justify-between flex-row-reverse text-right gap-1">
                                <span className="text-slate-400 text-xs font-bold shrink-0">اسم العضو (المستحق):</span>
                                <span className="font-extrabold text-white text-[11px] select-all flex items-center gap-1 flex-row-reverse truncate max-w-[180px]">
                                  <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  {v.userEmail}
                                </span>
                              </div>

                              <div className="flex items-center justify-between flex-row-reverse text-right gap-1">
                                <span className="text-slate-400 text-xs font-bold shrink-0">حساب المتفاعل:</span>
                                <span className="font-bold text-emerald-400 text-[11px] bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 select-all truncate max-w-[180px]">
                                  {v.profileHandle || 'لم يقدم'}
                                </span>
                              </div>

                              <div className="flex items-center justify-between flex-row-reverse text-right gap-1">
                                <span className="text-slate-400 text-xs font-bold shrink-0">نوع ومهمة المنصة:</span>
                                {getPlatformBadge(v.campaignType)}
                              </div>

                              <div className="flex items-center justify-between flex-row-reverse text-right gap-1">
                                <span className="text-slate-400 text-xs font-bold shrink-0">عنوان الحملة:</span>
                                <span className="text-white font-semibold text-[11px] truncate max-w-[155px]" title={v.campaignTitle}>
                                  {v.campaignTitle}
                                </span>
                              </div>
                            </div>

                            {/* Clickable Original Task URL */}
                            <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30 space-y-2.5 mt-2 shadow-inner">
                              <div className="text-indigo-400 text-xs font-black flex items-center gap-1.5 flex-row-reverse text-right">
                                <ExternalLink className="w-4 h-4 shrink-0" />
                                <span>التحقق من الرابط الأصلي للحملة:</span>
                              </div>
                              
                              {resolvedUrl ? (
                                <div className="space-y-2">
                                  <a
                                    href={resolvedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 px-3 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-lg border border-indigo-400/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-1.5"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                    <span>فتح الرابط مباشرة في نافذة جديدة 🔍</span>
                                  </a>
                                  
                                  <div className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-900 break-all font-mono select-all text-left" dir="ltr">
                                    {resolvedUrl}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-500 font-bold text-[11px] block text-center py-1">غير متوفر (يرجى مراجعة عنوان المهمة أعلاه)</span>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-500 mr-1">
                              تاريخ الرفع: {new Date(v.createdAt).toLocaleString('ar-EG')}
                            </div>
                          </div>

                          {/* Image preview box */}
                          {v.screenshotBase64 && (
                            <div className="relative group rounded-2xl overflow-hidden border border-slate-800 max-h-[160px] bg-slate-900 flex items-center justify-center">
                              <img
                                src={v.screenshotBase64}
                                alt="Screenshot Verification"
                                className="w-full h-[160px] object-cover transition duration-300 group-hover:scale-[1.03]"
                              />
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                                <span className="text-white text-[11px] font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full shadow-lg">
                                  🔍 انقر لتكبير وتوضيح الصورة بالكامل
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setViewingScreenshot(v.screenshotBase64)}
                                className="absolute inset-0 w-full h-full cursor-zoom-in"
                                title="تكبير الصورة للتحقق"
                              />
                            </div>
                          )}
                        </div>

                        {/* Decision Buttons (Only for pending) */}
                        {v.status === 'pending' && (
                          <div className="flex gap-2 pt-3 border-t border-slate-900">
                            <button
                              id={`ver-approve-${v.id}`}
                              onClick={() => {
                                if (db.approveTaskVerification(v.id)) {
                                  onAdminActionDone();
                                }
                              }}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1 active:scale-[0.98] transition"
                            >
                              <span>✓ موافقة واحتساب النقاط</span>
                            </button>
                            <button
                              id={`ver-reject-${v.id}`}
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من رفض لقطة الشاشة هذه وعدم استحقاق النقاط؟')) {
                                  if (db.rejectTaskVerification(v.id)) {
                                    onAdminActionDone();
                                  }
                                }
                              }}
                              className="px-3 py-2 bg-red-650 bg-red-600/15 hover:bg-red-600 hover:text-white text-red-500 font-bold text-xs rounded-xl border border-red-500/20 cursor-pointer transition"
                            >
                              <span>✗ رفض</span>
                            </button>
                          </div>
                        )}

                        {v.status !== 'pending' && (
                          <div className={`text-center py-2 text-xs font-black rounded-xl ${
                            v.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {v.status === 'approved' ? '✓ تم الموافقة الإدارية وإرسال النقاط' : '✗ تم رفض الطلب من قِبل الأدمن'}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR FULL VIEWING ENLARGEMENT IMAGE */}
      {viewingScreenshot && (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-4" dir="rtl">
          <button
            onClick={() => setViewingScreenshot(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white p-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <span>إغلاق التكبير ×</span>
          </button>
          
          <div className="max-w-4xl max-h-[80vh] overflow-auto rounded-3xl border border-slate-800 shadow-2xl p-2 bg-slate-900">
            <img
              src={viewingScreenshot}
              alt="Verification Enlargement"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>

          <p className="text-slate-400 text-xs font-semibold mt-4 text-center">
            بإمكانك قراءة التفاصيل ومطابقة اسم الحساب/الإجراء بدقة من لقطة الشاشة بالأعلى
          </p>
        </div>
      )}

      {/* TAB CONTENT: PAYMENTS */}
      {adminTab === 'payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-5">الحوالات المالية الكريبتو والمحفظات قيد الانتظار ({payments.filter(p => p.status === 'pending').length})</h3>
          {payments.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">لا توجد طلبات إيداع مقدمة للمراجعة حالياً.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {payments.map((pay) => {
                const memberUser = users.find(u => u.uid === pay.userId);
                const memberName = memberUser?.displayName || pay.userEmail.split('@')[0];
                return (
                  <div id={`pay-row-${pay.id}`} key={pay.id} className="py-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 text-right" dir="rtl">
                    <div className="space-y-2 text-right flex-1 w-full">
                      <div className="flex items-center gap-2 flex-wrap justify-start">
                        <span className="text-sm font-black text-white">العضو: {memberName}</span>
                        <span className="text-xs text-slate-400">({pay.userEmail})</span>
                        <span className="bg-slate-950 px-2.5 py-1 border border-slate-805 rounded-lg font-mono text-[11px] font-black text-amber-500">{pay.cryptoCurrency}</span>
                      </div>
                      
                      <div className="text-xs text-slate-300">
                        الباقة المطلوبة: <span className="text-emerald-400 font-extrabold">{pay.packagePoints.toLocaleString()} نقطة</span> مقابل <span className="text-white font-extrabold">${pay.packagePrice}</span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                        <span>رقم محفظة / هاتف المرسل:</span>
                        <span className="text-slate-100 font-mono select-all font-bold bg-slate-950 px-2.5 py-1.5 border border-slate-800 rounded-xl">
                          {pay.transactionHash}
                        </span>
                        
                        {pay.screenshotUrl && (
                          <button
                            type="button"
                            onClick={() => setViewingScreenshot(pay.screenshotUrl!)}
                            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-[10px] font-black rounded-xl cursor-pointer transition flex items-center gap-1.5 border border-amber-500/25 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            عرض إيصال التحويل المرفق 🖼️
                          </button>
                        )}
                      </div>

                      {pay.screenshotUrl && pay.screenshotUrl.startsWith('data:image/') ? (
                        <div className="mt-3 max-w-xs text-right">
                          <span className="text-[10px] text-slate-400 block mb-1">🔍 مصغر الإيصال (اضغط للتكبير الكامل):</span>
                          <div className="relative group border border-slate-800 rounded-xl overflow-hidden bg-slate-950 aspect-video max-w-[180px] shadow-sm">
                            <img 
                              src={pay.screenshotUrl} 
                              alt="Receipt proof" 
                              className="w-full h-full object-cover cursor-zoom-in transition-all duration-300 hover:scale-105"
                              onClick={() => setViewingScreenshot(pay.screenshotUrl!)}
                            />
                            <div className="absolute inset-x-0 bottom-0 py-1 bg-black/75 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[8px] text-white">
                              اضغط لتكبير الصورة
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {pay.status === 'rejected' && pay.rejectReason && (
                        <div className="text-[11px] text-red-400 font-semibold bg-red-950/10 border border-red-500/20 px-3 py-1.5 rounded-xl max-w-lg mt-2">
                          سبب الرفض: {pay.rejectReason}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-500 mt-1">
                        تاريخ وكود الطلب: {new Date(pay.createdAt).toLocaleString('ar-EG')} | معرف المعاملة: {pay.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-center">
                      {pay.status === 'pending' ? (
                        <>
                          <button
                            id={`approve-btn-${pay.id}`}
                            onClick={() => handleApprovePayment(pay.id)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
                          >
                            <Check className="w-4 h-4" />
                            موافقة وشحن النقاط
                          </button>
                          <button
                            id={`reject-btn-${pay.id}`}
                            onClick={() => {
                              setRejectingPaymentId(pay.id);
                              setRejectionReasonText('');
                            }}
                            className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all active:scale-95 border border-red-500/10"
                          >
                            <X className="w-4 h-4" />
                            رفض الحوالة
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1.5 font-bold text-xs rounded-xl ${
                          pay.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'
                        }`}>
                          {pay.status === 'approved' ? '✓ تم الموافقة والشحن' : '✗ تم الرفض'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[201] flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center flex-row-reverse">
              <h3 className="text-sm font-black text-white">إدخال سبب رفض شحن النقاط</h3>
              <button 
                onClick={() => setRejectingPaymentId(null)}
                className="text-slate-400 hover:text-white transition text-xl cursor-pointer"
              >
                ×
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed text-right">
              يرجى كتابة سبب رفض هذه المعاملة بوضوح ليظهر للعضو المعني في قائمة الحوالات وسجل الشراء الخاص به.
            </p>
            <textarea
              className="w-full h-24 p-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs text-white placeholder-slate-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-right"
              placeholder="مثال: صورة التحويل المرفقة غير واضحة / رقم المحفظة غير مطابق لبيانات الدفع / لم يتم استلام نقاط بالدفع."
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
            />
            <div className="flex items-center gap-2 flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  handleRejectPayment(rejectingPaymentId, rejectionReasonText.trim() || 'تم الرفض بواسطة الإدارة لعدم مطابقة الشروط أو عدم وصول الدفع.');
                  setRejectingPaymentId(null);
                  setRejectionReasonText('');
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex-1 shadow-lg"
              >
                تأكيد رفض الطلب نهائياً
              </button>
              <button
                type="button"
                onClick={() => setRejectingPaymentId(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition-all"
              >
                تصغير وإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WITHDRAWALS (PTS EXCHANGE TO USD CASH) */}
      {adminTab === 'withdrawals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-5 flex items-center justify-between">
            <span>مراجعة طلبات استبدال النقاط والسحب المعلقة ({withdrawalsList.filter(w => w.status === 'pending').length})</span>
          </h3>

          {withdrawalsList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">لا توجد طلبات استبدال نقاط مقدمة حالياً.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {withdrawalsList.map((req) => (
                <div id={`with-row-${req.id}`} key={req.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
                  <div className="space-y-1 text-right flex-1 select-text">
                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                      <span className="text-sm font-bold text-white">{req.userEmail}</span>
                      <span className="bg-slate-900 px-2 py-0.5 border border-slate-805 rounded font-bold text-[10px] text-amber-500">
                        {req.type === 'withdrawal' ? '💸 طلب سحب كاش' : '🔄 تحويل نقاط متراكمة'}
                      </span>
                      {req.type === 'withdrawal' && (
                        <span className="bg-slate-950 px-2 py-0.5 border border-slate-800 rounded font-mono text-xs text-white">
                          {req.method === 'VF_CASH' ? 'فودافون كاش' :
                           req.method === 'ET_CASH' ? 'اتصالات كاش' :
                           req.method === 'OR_CASH' ? 'أورنج كاش' :
                           req.method === 'WE_CASH' ? 'وي كاش' :
                           req.method === 'INSTAPAY' ? 'إنستا باي' : req.method}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-400 mt-1">
                      {req.type === 'withdrawal' ? (
                        <span>
                          طلب سحب مبلغ أرباح بقيمة <span className="text-emerald-400 font-extrabold">${req.dollarsEarned}</span> من حسابه الدولاري
                          <span className="text-[10px] text-slate-500 font-sans"> (تعادل حوالي {req.dollarsEarned * 50} ج.م)</span>
                        </span>
                      ) : (
                        <span>
                          طلب استبدال <span className="text-amber-500 font-bold">{req.pointsExchanged.toLocaleString()} نقطة</span> مقابل إضافة مبلغ <span className="text-emerald-400 font-black">${req.dollarsEarned}</span> لحسابه
                          <span className="text-[10px] text-slate-500 font-sans"> (تعادل حوالي {req.dollarsEarned * 50} ج.م)</span>
                        </span>
                      )}
                    </div>

                    {req.type === 'withdrawal' ? (
                      <div className="text-xs font-mono font-bold bg-slate-950 p-2 text-emerald-400 rounded max-w-lg mt-1 text-right border border-emerald-500/10">
                        رقم الهاتف / عنوان المحفظة للمستلم: <span className="text-white select-all">{req.walletOrPhone}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-0.5">
                        سيتم إضافة القيمة تلقائياً لرصيد دولارات العضو عند النقر فوق موافقة
                      </div>
                    )}

                    <div className="text-[10px] text-slate-500">
                      تاريخ الطلب: {new Date(req.createdAt).toLocaleString('ar-EG')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          id={`with-approve-btn-${req.id}`}
                          onClick={() => handleApproveWithdrawal(req.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {req.type === 'withdrawal' ? 'موافقة وتأكيد دفع الكاش للمستلم' : 'موافقة وإضافة أرباح الدولار للحساب'}
                        </button>
                        <button
                          id={`with-reject-btn-${req.id}`}
                          onClick={() => handleRejectWithdrawal(req.id)}
                          className="px-4 py-2 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          {req.type === 'withdrawal' ? 'الرفض وإعادة الدولارات للمشترك' : 'الرفض وإعادة النقاط للمشترك'}
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 font-bold text-xs rounded-lg ${
                        req.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                      }`}>
                        {req.status === 'approved' 
                          ? (req.type === 'withdrawal' ? 'مكتمل وتم التحويل والاعتماد ✅' : 'مكتمل وتم إضافة الدولار لرصيد العضو ✅') 
                          : (req.type === 'withdrawal' ? 'مرفوض وتم إعادة الدولارات لرصيد المشترك ❌' : 'مرفوض وتم إعادة النقاط للمشترك ❌')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: WALLETS */}
      {adminTab === 'wallets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-md">
          <h3 className="text-base font-black text-white mb-2">تهيئة بوابات استقبال الأموال والمحافظ</h3>
          <p className="text-xs text-slate-400 mb-6 font-semibold">
            قم بإدخال تفاصيل محافظ استقبال الدفع، سواء الكاش المحلي المصري أو العملات الرقمية. سيتم عرض هذه البيانات للعملاء فورياً لتسهيل الشراء والمراقبة.
          </p>

          {settingsMessage && (
            <div className="p-3 mb-5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs text-center font-bold">
              {settingsMessage}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-8 text-right">
            {/* Section 1: Local E-Wallets Cash */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-amber-500 border-b border-slate-800 pb-2 flex items-center justify-end gap-1.5">
                <span>محافظ الكاش المحلية والدفع الفوري (مصر)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رقم فودافون كاش (Vodafone Cash)</label>
                  <input
                    id="admin-vodafone-cash"
                    type="text"
                    value={vodafone}
                    onChange={(e) => setVodafone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="e.g. 01012345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رقم اتصالات كاش (Etisalat Cash)</label>
                  <input
                    id="admin-etisalat-cash"
                    type="text"
                    value={etisalat}
                    onChange={(e) => setEtisalat(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="e.g. 01112345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رقم أورنج كاش (Orange Cash)</label>
                  <input
                    id="admin-orange-cash"
                    type="text"
                    value={orange}
                    onChange={(e) => setOrange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="e.g. 01212345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رقم وي كاش (WE Cash)</label>
                  <input
                    id="admin-we-cash"
                    type="text"
                    value={we}
                    onChange={(e) => setWe(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="e.g. 01512345678"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">حساب إنستا باي (InstaPay Address)</label>
                  <input
                    id="admin-instapay"
                    type="text"
                    value={insta}
                    onChange={(e) => setInsta(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="username@instapay"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Blockchain / Crypto */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-black text-emerald-500 border-b border-slate-800 pb-2 flex items-center justify-end gap-1.5">
                <span>عناوين محافظ العملات الرقمية والبلوكشين (Crypto)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-355 mb-1.5">عنوان محفظة تتر USDT (ERC20 / TRC20)</label>
                  <input
                    id="admin-usdt-input"
                    type="text"
                    value={usdt}
                    onChange={(e) => setUsdt(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="USDT Wallet Address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-355 mb-1.5">عنوان محفظة البيتكوين BTC</label>
                  <input
                    id="admin-btc-input"
                    type="text"
                    value={btc}
                    onChange={(e) => setBtc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-805 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="BTC Address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-355 mb-1.5">عنوان محفظة الإيثيريوم ETH (USDT ERC20)</label>
                  <input
                    id="admin-eth-input"
                    type="text"
                    value={eth}
                    onChange={(e) => setEth(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="ETH Address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-355 mb-1.5">عنوان محفظة ترون TRX (USDT TRC20)</label>
                  <input
                    id="admin-trx-input"
                    type="text"
                    value={trx}
                    onChange={(e) => setTrx(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="TRX Address"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-355 mb-1.5">عنوان محفظة دوج كوين DOGE</label>
                  <input
                    id="admin-doge-input"
                    type="text"
                    value={doge}
                    onChange={(e) => setDoge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="DOGE Address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Technical Support Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h4 className="text-sm font-black text-indigo-500 border-b border-slate-800 pb-2 flex items-center justify-end gap-1.5 font-sans">
                <span>إعدادات الدعم الفني وتواصل الأعضاء</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5 font-sans">البريد الإلكتروني الرسمي لاستلام الشكاوى</label>
                  <input
                    id="admin-settings-support-email"
                    type="email"
                    value={supportEmailState}
                    onChange={(e) => setSupportEmailState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="e.g. support@socialxchange.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-355 mb-1.5 font-sans">رابط صفحة الفيس بوك الخاصة بالموقع</label>
                  <input
                    id="admin-settings-facebook-page"
                    type="text"
                    value={facebookPageUrlState}
                    onChange={(e) => setFacebookPageUrlState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="https://facebook.com/yourpage"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              id="admin-save-wallets-btn"
              type="submit"
              className="w-full py-3 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ المحافظ، عناوين الكاش، وبوابات الدعم وتحديثها</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT: CAMPAIGNS */}
      {adminTab === 'campaigns' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <h3 className="text-base font-bold text-white mb-5">الحملات الإعلانية النشطة بموقع التبادل ({campaigns.length})</h3>
          
          {campaigns.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">لا توجد أي خطط إعلانية مسجلة بالنظام حالياً.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-4 text-right">نوع الإجراء</th>
                    <th className="py-2.5 px-4 font-bold text-slate-200 text-right">صاحب الحملة</th>
                    <th className="py-2.5 px-4 text-right">عنوان الإعلان</th>
                    <th className="py-2.5 px-4 text-center">التقدم</th>
                    <th className="py-2.5 px-4 text-center">التكاليف</th>
                    <th className="py-2.5 px-4 text-center">الحالة</th>
                    <th className="py-2.5 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {campaigns.map((camp) => (
                    <React.Fragment key={camp.id}>
                      <tr className={editingCampaignId === camp.id ? 'bg-indigo-950/10' : ''}>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            camp.type === 'view' ? 'bg-red-500/10 text-red-400' :
                            camp.type === 'like' ? 'bg-emerald-500/10 text-emerald-400' :
                            camp.type === 'subscribe' ? 'bg-blue-500/10 text-blue-400' :
                            camp.type === 'tg_join' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10' :
                            camp.type.startsWith('fb_') ? 'bg-indigo-500/10 text-indigo-400' :
                            camp.type.startsWith('x_') ? 'bg-slate-350/10 text-slate-350 border border-slate-700/20' :
                            camp.type === 'website_view' ? 'bg-teal-500/10 text-teal-400' :
                            camp.type.startsWith('tiktok_') ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/10' : 'bg-pink-500/10 text-pink-400'
                          }`}>
                            {camp.type === 'view' && 'مشاهدة يوتيوب'}
                            {camp.type === 'like' && 'لايك يوتيوب'}
                            {camp.type === 'subscribe' && 'اشتراك يوتيوب'}
                            {camp.type === 'fb_like' && 'لايك فيسبوك'}
                            {camp.type === 'fb_follow' && 'متابعة فيسبوك'}
                            {camp.type === 'ig_like' && 'لايك انستجرام'}
                            {camp.type === 'ig_follow' && 'متابعة انستجرام'}
                            {camp.type === 'tiktok_like' && 'لايك تيك توك'}
                            {camp.type === 'tiktok_follow' && 'متابعة تيك توك'}
                            {camp.type === 'x_follow' && 'متابعة إكس'}
                            {camp.type === 'x_like' && 'لايك إكس'}
                            {camp.type === 'website_view' && 'مشاهدة المواقع'}
                            {camp.type === 'tg_join' && 'اشتراك تليجرام'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-400 text-[10px] max-w-[120px] truncate">{camp.creatorEmail}</td>
                        <td className="py-3 px-4 font-bold text-white max-w-[200px] truncate">
                          <div>{camp.title}</div>
                          {camp.customFields && camp.customFields.length > 0 && (
                            <div className="flex flex-col gap-1 mt-1 font-sans justify-end text-right">
                              {camp.customFields.map((f) => (
                                <span key={f.id} className="text-[9px] bg-slate-950 font-semibold border border-slate-800 text-indigo-400 px-1.5 py-0.5 rounded inline-block max-w-[180px] truncate">
                                  {f.label}: <strong className="text-slate-300">{f.value || 'لا يوجد'}</strong>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center gap-1 font-mono text-[10px]">
                            <span>{camp.completedCount} من {camp.quantity}</span>
                            <div className="w-16 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (camp.completedCount / camp.quantity) * 100)}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-500">
                          <div>{(camp.pointsPerAction * camp.quantity).toLocaleString()} ن</div>
                          <div className="text-[9px] text-slate-500 font-normal">
                            ({camp.pointsPerAction} ن لكل عمل) / ({camp.rewardPerAction || Math.round(camp.pointsPerAction * 0.8)} ن للزائر)
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                            camp.status === 'paused' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {camp.status === 'active' ? 'نشط' : camp.status === 'paused' ? 'مؤقت' : 'مكتمل'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {camp.status !== 'completed' && (
                              <button
                                id={`toggle-admin-camp-btn-${camp.id}`}
                                onClick={() => handleToggleCampaignStatus(camp.id)}
                                className={`p-1.5 rounded-lg transition ${
                                  camp.status === 'active'
                                    ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white'
                                }`}
                                title={camp.status === 'active' ? 'إيقاف الحملة مؤقتاً' : 'تنشيط الحملة'}
                              >
                                {camp.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              </button>
                            )}
                            <button
                              id={`edit-camp-btn-${camp.id}`}
                              onClick={() => handleStartEditingCampaign(camp)}
                              className="p-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition"
                              title="تعديل النقاط والخانات المخصصة"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`del-camp-btn-${camp.id}`}
                              onClick={() => handleDeleteCampaign(camp.id)}
                              className="p-1.5 bg-red-650/15 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition"
                              title="حذف الإعلان"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {editingCampaignId === camp.id && (
                        <tr className="bg-slate-950/85">
                          <td colSpan={7} className="py-4 px-6 text-right">
                            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-5 max-w-4xl mx-auto shadow-2xl transition-all duration-300">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-3 flex-row-reverse mb-2">
                                <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black">
                                  <span>🛡️ تعديل نقاط وخانات الحملة (غرفة التحكم المباشرة)</span>
                                </div>
                                <span className="text-xs font-black text-slate-350">
                                  الحملة: <strong className="text-white text-sm">{camp.title}</strong>
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                <div className="space-y-2 text-right">
                                  <label className="block text-xs text-slate-400 font-extrabold">النقاط المستقطعة من المعلن لكل عمل (Deducted Points)</label>
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setEditingPoints(prev => Math.max(5, prev - 5))}
                                      className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg border border-slate-800 font-black cursor-pointer text-sm"
                                      title="إنقاص"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={editingPoints}
                                      onChange={(e) => setEditingPoints(Math.max(1, parseInt(e.target.value) || 0))}
                                      className="w-28 text-center py-1.5 bg-slate-900 border border-slate-850 rounded-lg text-xs text-white outline-none font-extrabold text-mono"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setEditingPoints(prev => prev + 5)}
                                      className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg border border-slate-800 font-black cursor-pointer text-sm"
                                      title="زيادة"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-slate-550 block">حاليًا يستقطع {editingPoints} نقطة من رصيد المعلن.</span>
                                </div>

                                <div className="space-y-2 text-right">
                                  <label className="block text-xs text-slate-400 font-extrabold">مكافأة الزائر للعمل الواحد (User Reward)</label>
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setEditingReward(prev => Math.max(1, prev - 5))}
                                      className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg border border-slate-800 font-black cursor-pointer text-sm"
                                      title="إنقاص"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={editingReward}
                                      onChange={(e) => setEditingReward(Math.max(1, parseInt(e.target.value) || 0))}
                                      className="w-28 text-center py-1.5 bg-slate-900 border border-slate-850 rounded-lg text-xs text-white outline-none font-extrabold text-mono"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setEditingReward(prev => prev + 5)}
                                      className="w-8 h-8 flex items-center justify-center bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg border border-slate-800 font-black cursor-pointer text-sm"
                                      title="زيادة"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-slate-550 block">يكسب الزائر {editingReward} نقطة عند إنجاز العملية.</span>
                                </div>
                              </div>

                              <div className="border-t border-slate-900 pt-3.5 space-y-3">
                                <div className="flex justify-between items-center flex-row-reverse pb-1">
                                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-bold">الحقول المخصصة</span>
                                  <label className="block text-xs text-slate-350 font-black">البيانات الإضافية المطلوبة للتحقق من التفاعل (إدخال يدوي/ديناميكي)</label>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!newAdminFieldName.trim()) return;
                                      const newF = {
                                        id: 'df_' + Math.random().toString(36).substring(2, 7),
                                        label: newAdminFieldName.trim(),
                                        value: ''
                                      };
                                      setEditingFields(prev => [...prev, newF]);
                                      setNewAdminFieldName('');
                                    }}
                                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition cursor-pointer shrink-0"
                                  >
                                    إضافة حقل جديد
                                  </button>
                                  <input
                                    type="text"
                                    placeholder="اكتب اسم الخانة المطلوبة (مثال: رقم الواتساب، السن، لقطة شاشة، ملاحظة)"
                                    value={newAdminFieldName}
                                    onChange={(e) => setNewAdminFieldName(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-right text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (!newAdminFieldName.trim()) return;
                                        const newF = {
                                          id: 'df_' + Math.random().toString(36).substring(2, 7),
                                          label: newAdminFieldName.trim(),
                                          value: ''
                                        };
                                        setEditingFields(prev => [...prev, newF]);
                                        setNewAdminFieldName('');
                                      }
                                    }}
                                  />
                                </div>

                                {editingFields.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                                    {editingFields.map((field) => (
                                      <div key={field.id} className="bg-slate-900 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-right gap-4">
                                        <button
                                          type="button"
                                          onClick={() => setEditingFields(prev => prev.filter(f => f.id !== field.id))}
                                          className="text-red-500 hover:text-red-400 text-[10px] font-extrabold cursor-pointer transition border border-red-500/10 hover:border-red-500/30 px-2 py-1 bg-red-500/5 rounded-md"
                                          title="حذف"
                                        >
                                          إزالة
                                        </button>
                                        <div className="flex-grow flex flex-col gap-1 text-right">
                                          <span className="text-[10px] text-slate-350 font-black">{field.label}</span>
                                          <input
                                            type="text"
                                            placeholder={`أدخل قيمة افتراضية أو اتركها فارغة`}
                                            value={field.value}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setEditingFields(prev => prev.map(f => f.id === field.id ? { ...f, value: val } : f));
                                            }}
                                            className="w-full text-right bg-slate-950 border border-slate-800 px-2.5 py-1 text-[11px] rounded-lg text-white placeholder-slate-700 outline-none focus:border-indigo-500 text-mono"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-900">
                                <button
                                  type="button"
                                  onClick={() => setEditingCampaignId(null)}
                                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 font-bold rounded-lg text-xs cursor-pointer transition"
                                >
                                  إلغاء
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveCampaignEdits(camp.id)}
                                  className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg text-xs cursor-pointer transition flex items-center gap-1.5 shadow-lg active:scale-98"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>تحديث وحفظ التعديلات فورًا</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: USERS */}
      {adminTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3 flex-row-reverse">
            <h3 className="text-base font-bold text-white">إدارة أرصدة الأعضاء وتتبع المستخدمين ({filteredUsers.length})</h3>
            <div className="relative">
              <input
                id="search-users-input"
                type="text"
                value={usersFilter}
                onChange={(e) => setUsersFilter(e.target.value)}
                placeholder="ابحث عن عضو بالإيميل أو الاسم..."
                className="px-3 py-1.5 pl-8 bg-slate-950 border border-slate-850 text-xs rounded-xl outline-none text-right placeholder-slate-600 focus:border-red-500 min-w-[200px] text-white"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-605" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-4 text-right">العضو</th>
                  <th className="py-2.5 px-4 text-slate-200 text-right">البريد الإلكتروني</th>
                  <th className="py-2.5 px-4 text-center">الرصيد الكلي</th>
                  <th className="py-2.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-950/35">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={u.photoURL} alt={u.displayName} className="w-7 h-7 rounded-full bg-slate-800" />
                        <span className="font-bold text-white text-[11px]">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[10px] text-right">{u.email}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-amber-500 font-mono">{u.points.toLocaleString()} نقطة</td>
                    <td className="py-3 px-4 text-center">
                      {adjustingUser === u.uid ? (
                        <div className="flex items-center justify-center gap-2" id={`adjust-panel-${u.uid}`}>
                          <input
                            id={`pts-delta-${u.uid}`}
                            type="number"
                            value={pointsDelta}
                            onChange={(e) => setPointsDelta(parseInt(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 bg-slate-950 border border-slate-800 text-center rounded text-xs text-white"
                            placeholder="عدد"
                          />
                          <button
                            id={`save-pts-${u.uid}`}
                            onClick={() => handleAdjustPoints(u.uid)}
                            className="bg-emerald-600 text-white rounded p-1.5 font-bold text-[10px]"
                          >
                            تعديل
                          </button>
                          <button
                            id={`cancel-pts-${u.uid}`}
                            onClick={() => setAdjustingUser(null)}
                            className="bg-slate-800 text-slate-400 rounded p-1.5 text-[10px]"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`edit-pts-${u.uid}`}
                          onClick={() => {
                            setAdjustingUser(u.uid);
                            setPointsDelta(1000); // default suggest
                          }}
                          className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-red-500" />
                          تعديل رصيد النقاط
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADS */}
      {adminTab === 'ads' && (
        <div className="space-y-6">
          {/* Add Ad form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-md">
            <h3 className="text-base font-bold text-white mb-4">إنشاء وإسناد مساحة إعلانية جديدة</h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">بإمكانك إضافة صور بنرات تفاعلية وتوجيه الزوار إلى روابط خارجية حسب الحجم وموضع العرض المناسب.</p>

            {adMessage && (
              <div className="p-3 mb-5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs text-center font-bold">
                {adMessage}
              </div>
            )}

            <form onSubmit={handleAddAd} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-350 mb-1.5 font-sans">عنوان البنر / الجهة المعلنة</label>
                  <input
                    id="admin-ad-title"
                    type="text"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-right text-white outline-none"
                    placeholder="مثال: يوتيوب برو - لزيادة المشتركين"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رابط البنر التوجيهي (URL)</label>
                  <input
                    id="admin-ad-target-url"
                    type="url"
                    value={adTargetUrl}
                    onChange={(e) => setAdTargetUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">مكان وتناسب المساحة الإعلانية</label>
                  <select
                    id="admin-ad-position"
                    value={adPosition}
                    onChange={(e) => setAdPosition(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-right text-white outline-none cursor-pointer"
                  >
                    <option value="header">رأس الصفحة - بنر متناسب عريض (728x90)</option>
                    <option value="sidebar">الشريط الجانبي - مربع متراصف (250x250)</option>
                    <option value="footer">تذييل الموقع - بنر عريض أسفل الشاشة (728x90)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-350 mb-1.5">رابط صورة البنّر الإعلاني (URL)</label>
                  <input
                    id="admin-ad-image-url"
                    type="url"
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 text-xs text-left font-mono text-white outline-none mb-2"
                    placeholder="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800"
                    required
                  />
                  {adImageUrl.trim() && (
                    <div className="mt-2 p-2 bg-slate-950 border border-slate-850 rounded-xl text-center">
                      <p className="text-[10px] text-slate-500 mb-1.5">معاينة البنر المباشر:</p>
                      <img 
                        referrerPolicy="no-referrer"
                        src={adImageUrl} 
                        alt="Preview" 
                        className={`mx-auto rounded border border-slate-800 object-cover ${adPosition === 'sidebar' ? 'w-[250px] h-[250px]' : 'w-full max-w-[728px] h-[90px]'}`}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                id="admin-add-ad-btn"
                type="submit"
                className="w-full py-3 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10"
              >
                <Megaphone className="w-4 h-4" />
                <span>إدراج وتفعيل البنر الترويجي</span>
              </button>
            </form>
          </div>

          {/* Existing Ads List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-5">البنرات الإعلانية النشطة حالياً بالموقع ({ads.length})</h3>
            {ads.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">لا توجد بنرات إعلانية نشطة حالياً.</div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {ads.map((adItem) => (
                  <div key={adItem.id} className="bg-slate-950/60 p-4 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
                    <div className="flex flex-col md:flex-row gap-4 items-center flex-1 w-full flex-row-reverse md:flex-row">
                      <img 
                        referrerPolicy="no-referrer"
                        src={adItem.imageUrl} 
                        alt={adItem.title} 
                        className="w-32 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800 shrink-0" 
                      />
                      <div className="space-y-1 text-right flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{adItem.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center justify-end gap-1 font-semibold">
                          <span className="font-mono text-slate-500 text-[10px] truncate max-w-xs">{adItem.targetUrl}</span>
                          <span>رابط التوجيه:</span>
                        </p>
                        <p className="text-[10px] text-slate-505">
                          الموضع: <span className="bg-red-500/15 text-red-400 font-bold px-1.5 py-0.5 rounded text-[9px]">
                            {adItem.position === 'header' ? 'رأس الصفحة (728x90)' : 
                             adItem.position === 'sidebar' ? 'الشريط الجانبي (250x250)' : 'أسفل الشاشة (728x90)'}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      id={`del-ad-btn-${adItem.id}`}
                      onClick={() => handleDeleteAd(adItem.id)}
                      className="p-2 bg-red-650/15 hover:bg-red-650 text-red-500 hover:text-white rounded-xl transition cursor-pointer text-xs font-semibold self-end md:self-center flex items-center gap-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إزالة الإعلان</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUPPORT (REVIEWS & COMPLAINTS) */}
      {adminTab === 'support' && (
        <div className="space-y-8" dir="rtl">
          {/* Quick Support Contact Settings Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>تعديل قنوات التواصل المباشر ومعلومات الدعم للزوار</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold font-sans">تحديث البريد الإلكتروني ورابط صفحة الفيسبوك المعروضين في صفحة الدعم الفني للتواصل المباشر مع الأعضاء.</p>

            {settingsMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl mb-4 text-xs font-bold leading-none flex items-center gap-2 animate-pulse">
                <Check className="w-4 h-4 shrink-0" />
                <span>{settingsMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">البريد الإلكتروني للدعم الفني الذي يتلقى الشكاوى:</label>
                <input
                  type="email"
                  value={supportEmailState}
                  onChange={(e) => setSupportEmailState(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-left font-mono text-white outline-none focus:border-indigo-500/55"
                  placeholder="support@socialxchange.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">رابط صفحة الفيس بوك الخاصة بالموقع:</label>
                <input
                  type="text"
                  value={facebookPageUrlState}
                  onChange={(e) => setFacebookPageUrlState(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-left font-mono text-white outline-none focus:border-indigo-500/55"
                  placeholder="https://facebook.com/SocialXchange"
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-start pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <Save className="w-4 h-4" />
                  <span>تحديث قنوات تواصل الدعم فورياً</span>
                </button>
              </div>
            </form>
          </div>

          {/* DYNAMIC SUPPORT PLATFORMS EDITOR SECTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>إدارة وتخصيص أيقونات الدعم ومنصات التواصل الاجتماعي الأخرى</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">تحكم بالكامل بجميع المنصات والشبكات الاجتماعية والروابط والأيقونات التي تظهر للأعضاء في صفحة الدعم الفني، لتزويد أو تعديل أو تعطيل قنوات تواصل إضافية.</p>

            {/* Quick Add Form Trigger */}
            {!isAddingSupportPlat ? (
              <button
                type="button"
                onClick={() => setIsAddingSupportPlat(true)}
                className="mb-6 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
              >
                ➕ إضافة منصة دعم تواصل جديدة / أيقونة جديدة
              </button>
            ) : (
              <form onSubmit={handleAddSupportPlat} className="mb-6 bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2">
                  <h4 className="text-xs font-extrabold text-white">إضافة منصة تواصل ودعم جديدة</h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingSupportPlat(false)}
                    className="text-xs text-red-500 hover:underline font-bold"
                  >
                    إلغاء
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400">معرّف الفريد للمنصة (بالانجليزية):</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. whatsapp, telegram_group"
                      value={newSupportId}
                      onChange={(e) => setNewSupportId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400">اسم الزر أو العنوان المعروض:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: غروب التليجرام الرسمي، فودافون كاش كول"
                      value={newSupportName}
                      onChange={(e) => setNewSupportName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400">رابط التوجيه (أو mailto: / tel:):</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://t.me/..., tel:010..."
                      value={newSupportUrl}
                      onChange={(e) => setNewSupportUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-505"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-400">أيقونة العرض المناسبة:</label>
                    <select
                      value={newSupportIcon}
                      onChange={(e) => setNewSupportIcon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-indigo-505"
                    >
                      <option value="Facebook">فيس بوك (Facebook)</option>
                      <option value="Mail">رابط بريد (Mail)</option>
                      <option value="Send">طائرة تليجرام (Telegram / Send)</option>
                      <option value="Youtube">يوتيوب (Youtube)</option>
                      <option value="Instagram">انستغرام (Instagram)</option>
                      <option value="Flame">نار تيك توك / فليم (TikTok / Flame)</option>
                      <option value="Phone">سماعة هاتف (Phone)</option>
                      <option value="MessageCircle">واتساب (WhatsApp / MessageCircle)</option>
                      <option value="ShieldCheck">درع توثيق (ShieldCheck)</option>
                      <option value="Link2">رابط عام (Link2)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="py-1.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-lg transition"
                  >
                    حفظ وإضافة منصة دعم
                  </button>
                </div>
              </form>
            )}

            {/* List of Dynamic Support Platforms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(supportPlats || []).map((p, idx) => {
                const isEditing = editingSupportId === p.id;
                return (
                  <div key={p.id || idx} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between gap-3 text-right">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-1.5">
                          <span className="text-[10px] text-indigo-400 font-black">تحرير المنصة: {p.id}</span>
                          <button
                            type="button"
                            onClick={() => setEditingSupportId(null)}
                            className="text-[10px] text-red-500 hover:underline"
                          >
                            إلغاء
                          </button>
                        </div>

                        <div className="space-y-2 text-right">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 font-sans">اسم منصة التواصل:</label>
                            <input
                              type="text"
                              value={supportNameInput}
                              onChange={(e) => setSupportNameInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 font-sans">رابط الاتصال الكامل:</label>
                            <input
                              type="text"
                              value={supportUrlInput}
                              onChange={(e) => setSupportUrlInput(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 font-sans">الأيقونة رمز:</label>
                              <select
                                value={supportIconInput}
                                onChange={(e) => setSupportIconInput(e.target.value)}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none"
                              >
                                <option value="Facebook">فيس بوك</option>
                                <option value="Mail">رابط بريد (Mail)</option>
                                <option value="Send">تليجرام / طائرة</option>
                                <option value="Youtube">يوتيوب</option>
                                <option value="Instagram">انستغرام</option>
                                <option value="Flame">تيك توك</option>
                                <option value="Phone">سماعة هاتف</option>
                                <option value="MessageCircle">واتساب</option>
                                <option value="ShieldCheck">درع توثيق</option>
                                <option value="Link2">رابط عام</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-slate-400 font-sans">الحالة:</label>
                              <select
                                value={supportActiveInput ? 'yes' : 'no'}
                                onChange={(e) => setSupportActiveInput(e.target.value === 'yes')}
                                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none"
                              >
                                <option value="yes">نشط (تظهر للدعم)</option>
                                <option value="no">معطل (مخفي مؤقتاً)</option>
                              </select>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveSupportPlatEdit(p.id)}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-lg text-xs transition cursor-pointer mt-2"
                          >
                            حفظ وتطبيق التغييرات فورا
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 text-right flex-1">
                            <div className="flex items-center gap-2 justify-start">
                              <span className="text-xs font-black text-white">{p.name || 'قناة تواصل'}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                                p.isActive !== false ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-550 bg-red-600/10'
                              }`}>
                                {p.isActive !== false ? 'نشط' : 'معطل'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-none break-all font-mono select-all text-left mt-1" dir="ltr">{p.url}</p>
                            <span className="inline-block text-[9px] text-slate-600">رمز الأيقونة: <strong className="text-indigo-400 font-mono">{p.icon}</strong></span>
                          </div>

                          <span className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                            {p.icon === 'Facebook' && <Facebook className="w-4 h-4 text-blue-500" />}
                            {p.icon === 'Mail' && <Mail className="w-4 h-4 text-indigo-400" />}
                            {p.icon === 'Send' && <Send className="w-4 h-4 text-cyan-400" />}
                            {p.icon === 'Youtube' && <Youtube className="w-4 h-4 text-red-500" />}
                            {p.icon === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                            {p.icon === 'Flame' && <Flame className="w-4 h-4 text-orange-500" />}
                            {p.icon === 'Phone' && <Phone className="w-4 h-4 text-emerald-500" />}
                            {p.icon === 'MessageCircle' && <MessageCircle className="w-4 h-4 text-emerald-400" />}
                            {p.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                            {p.icon !== 'Facebook' && p.icon !== 'Mail' && p.icon !== 'Send' && p.icon !== 'Youtube' && p.icon !== 'Instagram' && p.icon !== 'Flame' && p.icon !== 'Phone' && p.icon !== 'MessageCircle' && p.icon !== 'ShieldCheck' && <Link2 className="w-4 h-4 text-slate-400" />}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-900 pt-3 mt-1 justify-end font-sans">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSupportId(p.id);
                              setSupportNameInput(p.name);
                              setSupportUrlInput(p.url);
                              setSupportIconInput(p.icon || 'Link2');
                              setSupportActiveInput(p.isActive !== false);
                            }}
                            className="text-[10px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                          >
                            🔧 تعديل
                          </button>
                          <span className="text-slate-800 font-mono">|</span>
                          <button
                            type="button"
                            onClick={() => handleToggleSupportPlat(p.id)}
                            className={`text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                              p.isActive !== false ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-400'
                            }`}
                          >
                            {p.isActive !== false ? '🚫 تعطيل مؤقت' : '✅ تمكين'}
                          </button>
                          <span className="text-slate-800 font-mono">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSupportPlat(p.id)}
                            className="text-[10px] font-bold text-red-500 hover:text-red-400 transition flex items-center gap-1 cursor-pointer"
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complaints Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>شكاوى واستفسارات الدعم المستلمة ({db.getComplaints().length})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold font-sans">بإمكانك الاطلاع على تذاكر الدعم والشكاوى المقدمة من المستخدمين والتواصل معهم فوراً.</p>

            {db.getComplaints().length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs font-sans">لا توجد أي شكاوى واردة من الأعضاء للظهور حالياً.</div>
            ) : (
              <div className="space-y-4">
                {db.getComplaints().map((comp: any) => (
                  <div key={comp.id} className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-4 text-right">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-extrabold text-white">{comp.subject}</span>
                        <span className="text-[10px] text-slate-400">بواسطة: {comp.displayName} ({comp.userEmail})</span>
                        <span className="text-[9px] text-slate-550 font-mono">ID: {comp.id}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/45 font-sans whitespace-pre-line">{comp.message}</p>
                      <div className="text-[10px] text-slate-500">
                        تاريخ الارسال: {new Date(comp.createdAt).toLocaleString('ar-EG')}
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                      <a 
                        href={`mailto:${comp.userEmail}?subject=بخصوص استفسارك بـ SocialXchange: ${encodeURIComponent(comp.subject)}`}
                        className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        الرد عبر الإيميل
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Feedback/Reviews Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              <span>آراء وتقييمات الأعضاء المنشورة ({db.getReviews().length})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">استعرض ما يكتبه مستخدمو منصة SocialXchange لمتابعة جودة أداء العمل.</p>

            {db.getReviews().length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">لم يقم أي مستخدم بكتابة تعليق أو تقييم للموقع حتى اللحظة.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {db.getReviews().map((rev: any) => (
                  <div key={rev.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={rev.userPhotoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(rev.displayName)}`}
                          alt={rev.displayName}
                          className="w-7 h-7 rounded-full bg-slate-850"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{rev.displayName}</h4>
                          <span className="text-[9px] text-slate-550">{rev.userEmail}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s}
                            className={`w-3 h-3 ${s <= rev.rating ? 'text-amber-500 fill-current' : 'text-slate-800'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{rev.comment}</p>
                    <div className="text-[9px] text-slate-550 text-left">
                      {new Date(rev.createdAt).toLocaleString('ar-EG')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: POINTS CONFIG & CUSTOM PLATFORMS */}
      {adminTab === 'points_config' && (
        <div className="space-y-8 text-right font-sans" dir="rtl">
          {/* Points config messages */}
          {settingsMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
              <Check className="w-5 h-5 shrink-0" />
              <span>{settingsMessage}</span>
            </div>
          )}

          {/* SECTION 1: EDIT STANDARD ACTIONS (PTS & REWARDS) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-indigo-400" />
              <span>تعديل نقاط تفاعل المنصات المدمجة</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">تحكم في التكلفة المستقطعة من المعلن والمكافأة المحسوبة للمستخدم عن كل منصة وتفاعل.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'view', name: 'مشاهدات يوتيوب', icon: Play, defPts: 50, defRwd: 40 },
                { key: 'like', name: 'لايكات يوتيوب', icon: Play, defPts: 60, defRwd: 40 },
                { key: 'subscribe', name: 'اشتراكات يوتيوب', icon: Play, defPts: 70, defRwd: 50 },
                { key: 'fb_follow', name: 'متابعي فيسبوك', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'fb_like', name: 'لايكات فيسبوك', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'ig_follow', name: 'متابعي انستجرام', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'ig_like', name: 'لايكات انستجرام', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'tiktok_follow', name: 'متابعي تيك توك', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'tiktok_like', name: 'لايكات تيك توك', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'x_follow', name: 'متابعي إكس (X Follow)', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'x_like', name: 'لايكات إكس (X Like)', icon: Users, defPts: 50, defRwd: 40 },
                { key: 'website_view', name: 'مشاهدة المواقع', icon: ExternalLink, defPts: 30, defRwd: 20 },
                { key: 'tg_join', name: 'اشتراك تليجرام', icon: Send, defPts: 50, defRwd: 40 }
              ].map((item) => {
                const conf = settings.pointsPerActionConfig?.[item.key] || { pointsPerAction: item.defPts, rewardPerAction: item.defRwd };
                const isEditing = editingBuiltInType === item.key;

                return (
                  <div key={item.key} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">{item.name}</span>
                      <span className="text-[10px] text-slate-550 font-mono">{item.key}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1 font-bold">خصم المعلن (ن):</label>
                            <input
                              type="number"
                              value={pointsCostInput}
                              onChange={(e) => setPointsCostInput(Math.max(1, Number(e.target.value)))}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono text-white rounded outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1 font-bold">ربح الزائر (ن):</label>
                            <input
                              type="number"
                              value={visitorRewardInput}
                              onChange={(e) => setVisitorRewardInput(Math.min(pointsCostInput, Math.max(1, Number(e.target.value))))}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono text-white rounded outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateBuiltInConfig(item.key, pointsCostInput, visitorRewardInput)}
                            className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] transition cursor-pointer"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingBuiltInType(null)}
                            className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-400 text-[10px] rounded hover:text-white transition cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/40 text-center text-xs">
                          <div>
                            <span className="block text-[9px] text-slate-550 font-bold mb-0.5">تكلفة الإطلاق</span>
                            <span className="font-mono font-black text-amber-500">{conf.pointsPerAction} ن</span>
                          </div>
                          <div className="border-r border-slate-850">
                            <span className="block text-[9px] text-slate-550 font-bold mb-0.5">مكافأة الزائر</span>
                            <span className="font-mono font-black text-indigo-400">{conf.rewardPerAction} ن</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingBuiltInType(item.key);
                            setPointsCostInput(conf.pointsPerAction);
                            setVisitorRewardInput(conf.rewardPerAction);
                          }}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold border border-slate-800 text-center transition cursor-pointer"
                        >
                          تعديل النقاط
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: MANAGE & ADD NEW PLATFORMS Dynamically */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>إدارة منصات وقنوات التبادل المضافة ({settings.customPlatforms?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">إضافة أو حذف أي خدمات/مهمات أو شبكات تواصل اجتماعي مخصصة هنا لتظهر للجميع.</p>
              </div>

              {!isAddingPlat ? (
                <button
                  type="button"
                  onClick={() => setIsAddingPlat(true)}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition self-start cursor-pointer shadow-lg"
                >
                  إضافة منصة تفاعل جديدة +
                </button>
              ) : null}
            </div>

            {/* ADD COMPONENT EXPANDER FORM */}
            {isAddingPlat && (
              <form onSubmit={handleAddCustomPlatform} className="bg-slate-950 border border-slate-850 p-6 rounded-2xl mb-6 space-y-4">
                <h4 className="text-sm font-extrabold text-white pb-2 border-b border-slate-850">إضافة منصة تواصل أو خدمة مخصصة جديدة</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">اسم الخدمة بالكامل (مثال: متابعة لينكد إن):</label>
                    <input
                      type="text"
                      value={newPlatName}
                      onChange={(e) => setNewPlatName(e.target.value)}
                      placeholder="متابعة حساب لينكد إن"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650 outline-none focus:border-indigo-500/"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">تكلفة الإطلاق (ن):</label>
                      <input
                        type="number"
                        value={newPlatPoints}
                        onChange={(e) => setNewPlatPoints(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl font-mono"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">مكافأة الزائر (ن):</label>
                      <input
                        type="number"
                        value={newPlatReward}
                        onChange={(e) => setNewPlatReward(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">العنوان التعريفي للرابط (URL Label):</label>
                    <input
                      type="text"
                      value={newPlatUrlLabel}
                      onChange={(e) => setNewPlatUrlLabel(e.target.value)}
                      placeholder="أدخل رابط حساب LinkedIn الشخصي"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300 font-sans">تلميح الرابط الافتراضي (URL Placeholder):</label>
                    <input
                      type="text"
                      value={newPlatUrlPlaceholder}
                      onChange={(e) => setNewPlatUrlPlaceholder(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl text-left placeholder-slate-650 font-mono"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300">تلميح مسمى التبعية (Title Placeholder):</label>
                    <input
                      type="text"
                      value={newPlatTitlePlaceholder}
                      onChange={(e) => setNewPlatTitlePlaceholder(e.target.value)}
                      placeholder="مثال: حساب المهندس عبدالرحمن للتطوير الرقمي"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl placeholder-slate-650"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-850">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs cursor-pointer transition shadow-lg"
                  >
                    حفظ الخدمة وتعميمها
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingPlat(false)}
                    className="py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-400 text-xs rounded-xl hover:text-white cursor-pointer transition animate-none"
                  >
                    إلغاء التراجع
                  </button>
                </div>
              </form>
            )}

            {/* CUSTOM PLATFORMS LIST */}
            {(!settings.customPlatforms || settings.customPlatforms.length === 0) ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-850/60 font-sans">
                لا توجد أي منصة أو شبكة اتصال اجتماعي مخصصة مضافة حالياً للتبادل.
              </div>
            ) : (
              <div className="space-y-3">
                {settings.customPlatforms.map((p) => {
                  return (
                    <div key={p.id} className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{p.name}</span>
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-mono font-bold">ID: {p.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">الرابط المطلوب: {p.urlLabel}</p>
                        <p className="text-[10px] text-slate-500 font-mono">تلميح الرابط: {p.urlPlaceholder}</p>
                      </div>

                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex gap-4 text-center">
                          <div>
                            <span className="block text-[9px] text-slate-550 mb-0.5 font-bold">خصم المعلن</span>
                            <span className="font-mono text-xs font-black text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10">{p.pointsPerAction} ن</span>
                          </div>
                          <div>
                            <span className="block text-[9px] text-slate-550 mb-0.5 font-bold">ربح الزائر</span>
                            <span className="font-mono text-xs font-black text-indigo-400 bg-indigo-400/5 px-2.5 py-1 rounded border border-indigo-500/10">{p.rewardPerAction} ن</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCustomPlatform(p.id)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/15 hover:border-red-550 rounded-xl transition cursor-pointer"
                          title="حذف هذه المنصة وسحب تفاعلاتها"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {adminTab === 'custom_campaigns' && (
        <div className="space-y-8 text-right font-sans" dir="rtl">
          {taskSuccessMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
              <Check className="w-5 h-5 shrink-0" />
              <span>{taskSuccessMsg}</span>
            </div>
          )}

          {/* SECTION 1: CREATE TASK */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>إنشاء ومضاعفة مهام رعاية للمنصات المضافة</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">يمكنك من هنا إطلاق حملات ومهام تفاعل برعاية مباشرة من الموقع، لتظهر لجميع الأعضاء في شاشة كسب النقاط للمنصات المخصصة المضافة دون التقييد بأرصدة المستخدمين.</p>

            {(!settings.customPlatforms || settings.customPlatforms.length === 0) ? (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-5 rounded-2xl text-xs font-semibold">
                ⚠️ عذراً، لا توجد أي منصات تفاعل مضافة حالياً في الموقع. 
                يرجى الذهاب أولاً إلى خانة 
                <button 
                  type="button"
                  onClick={() => setAdminTab('points_config')} 
                  className="mx-1 font-bold underline cursor-pointer text-indigo-400 hover:text-indigo-300"
                >
                  "تعديل نقاط وإدارة المنصات"
                </button> 
                لإضافة منصة تواصل جديدة (مثل LinkedIn أو X)، ثم ارجع إلى هنا لتقوم بإضافات المهمات التابعة لها!
              </div>
            ) : (
              <form onSubmit={handleCreateAdminTask} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">المنصة المضافة المستهدفة:</label>
                    <select
                      value={taskPlatform}
                      onChange={(e) => {
                        const platId = e.target.value;
                        setTaskPlatform(platId);
                        const found = settings.customPlatforms?.find(p => p.id === platId);
                        if (found) {
                          setTaskPointsPerAction(found.pointsPerAction || 50);
                          setTaskRewardPerAction(found.rewardPerAction || 40);
                        }
                      }}
                      className="w-full px-3 py-2.5 border border-slate-800 bg-slate-950 text-xs text-white rounded-xl outline-none focus:border-indigo-500"
                      required
                    >
                      {settings.customPlatforms.map((p) => (
                        <option key={p.id} value={p.id} className="bg-slate-950 text-white">
                          {p.name} (تكلفة: {p.pointsPerAction} ن | ربح: {p.rewardPerAction} ن)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">نوع المهمة ومسار التفاعل المطلوبة:</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value as any)}
                      className="w-full px-3 py-2.5 border border-slate-800 bg-slate-950 text-xs text-white rounded-xl outline-none focus:border-indigo-500"
                      required
                    >
                      <option value="subscription">اشتراك وانضمام لقنوات ومستندات (Subscription)</option>
                      <option value="view">مشاهدات فيديوهات وتصفح حقيقي زمني (View)</option>
                      <option value="like">تفاعلات لايك، ريتويت وإعجاب (Like)</option>
                      <option value="follow">متابعة وزيادة معجبين وفولو (Follow)</option>
                      <option value="other">أخرى / مهمة وتحدي رقمي مخصص (Custom)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">عنوان التفاعل أو المهمة الترويجية (أكثر جاذبية):</label>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="مثال: تابع صفحة المهندس الرسمية على لينكد إن للحصول على المكافأة"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-805 text-xs text-white rounded-xl placeholder-slate-650 focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">رابط الحساب أو التفاعل المستهدف (Target Link):</label>
                    <input
                      type="url"
                      value={taskUrl}
                      onChange={(e) => setTaskUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-805 text-xs text-white rounded-xl placeholder-slate-650 text-left font-mono focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300" title="الحد الأقصى لعدد التفاعلات المطلوبة من المستخدمين">الكمية (عدد التفاعلات المستهدفة):</label>
                      <input
                        type="number"
                        min="1"
                        value={taskQuantity}
                        onChange={(e) => setTaskQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-white rounded-xl font-mono text-center outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">خصم النقاط (تكلفة الإدارة):</label>
                      <input
                        type="number"
                        min="1"
                        value={taskPointsPerAction}
                        onChange={(e) => setTaskPointsPerAction(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-amber-500 rounded-xl font-mono text-center outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">نقاط المكافأة (جائزة العميل):</label>
                      <input
                        type="number"
                        min="1"
                        value={taskRewardPerAction}
                        onChange={(e) => setTaskRewardPerAction(Math.min(taskPointsPerAction, Math.max(1, Number(e.target.value))))}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-indigo-400 rounded-xl font-mono text-center outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">حقل مخصص إضافي (اختياري - كاسم الحقل):</label>
                    <input
                      type="text"
                      value={taskCustomFieldName1}
                      onChange={(e) => setTaskCustomFieldName1(e.target.value)}
                      placeholder="مثال: يرجى كتابة اسم حسابك للتحقق"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-white rounded-xl placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">قيمة الحقل المطلوب إدراجها (اختياري - كتلميح):</label>
                    <input
                      type="text"
                      value={taskCustomFieldValue1}
                      onChange={(e) => setTaskCustomFieldValue1(e.target.value)}
                      placeholder="مثال: @username"
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-850 text-xs text-white rounded-xl placeholder-slate-650 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950/40 p-3 rounded-2xl border border-slate-850 hover:border-indigo-505 transition">
                      <input
                        type="checkbox"
                        checked={taskFeatured}
                        onChange={(e) => setTaskFeatured(e.target.checked)}
                        className="w-4 h-4 text-indigo-650 rounded border-slate-800 bg-slate-950 focus:ring-0 checked:bg-indigo-650"
                      />
                      <div className="space-y-0.5 text-right">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                          <Flame className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
                          تعيين هذه المهمة كمهمة ترويجية مميزة ومثبتة (Featured ⭐️)
                        </span>
                        <span className="block text-[10px] text-slate-400">ستظهر هذه المهمة في أعلى القائمة للأعضاء مع خلفية ذهبية براقة لجذب أكبر عدد من المتفاعلين وإنجازها فوراً.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-850">
                  <button
                    type="submit"
                    className="py-3 px-8 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold rounded-xl text-xs cursor-pointer transition shadow-lg flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إنشاء ونشر المهمة فوراً على الموقع</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* SECTION 2: LIST CURRENT CUSTOM PLATFORM CAMPAIGNS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-black text-white mb-2 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-400" />
              <span>مهام التفاعل النشطة لخدمات المنصات المضافة والتحكم الكامل بها</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-sans">
              قائمة بجميع المهام المضافة يدوياً في الخادم للتفاعل. يمكنك تعديل أعداد التفاعلات المطلوبة، ضبط النقاط والجوائز، ضبط نوع المهمة (مشاهدة/اشتراك)، تتبع سير الطلبات، إيقافها، أو حذفها نهائياً بلمسة زر واحدة.
            </p>

            {campaigns.filter(c => c.type.startsWith('custom_')).length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-850/60 font-sans">
                لا توجد أي مهام أو حملات مضافة حالياً لخدمات المنصات المضافة.
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.filter(c => c.type.startsWith('custom_')).map((camp) => {
                  const plat = settings.customPlatforms?.find(p => p.id === camp.type);
                  const progress = camp.quantity > 0 ? (camp.completedCount / camp.quantity) * 100 : 0;
                  const isEditing = editingTaskId === camp.id;

                  return (
                    <div 
                      key={camp.id} 
                      className={`p-5 rounded-3xl border transition-all ${
                        camp.isFeatured 
                          ? 'bg-gradient-to-l from-slate-950 via-[#1a1405] to-slate-950 border-amber-500/20 shadow-amber-950/10 shadow-lg' 
                          : 'bg-slate-950 border-slate-850'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-4 text-right">
                          <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                            <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                              <Edit3 className="w-4 h-4 text-indigo-400" />
                              تعديل وإعادة تهيئة المهمة (معرّف: {camp.id})
                            </span>
                            <span className="text-[10px] bg-slate-900 px-2.5 py-1 text-slate-500 font-mono rounded-lg">ID Config Mode</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-slate-350">تعديل عنوان التفاعل:</label>
                              <input
                                type="text"
                                value={editingTaskTitle}
                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg focus:border-indigo-500 outline-none"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-slate-350">تعديل رابط التفاعل أو التوجيه والمصادقة:</label>
                              <input
                                type="url"
                                value={editingTaskUrl}
                                onChange={(e) => setEditingTaskUrl(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg focus:border-indigo-500 outline-none text-left font-mono"
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-xs font-bold text-slate-350">تعديل نوع المهمة المطلوبة لفلترة العرض:</label>
                              <select
                                value={editingTaskType}
                                onChange={(e) => setEditingTaskType(e.target.value as any)}
                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg focus:border-indigo-500 outline-none"
                              >
                                <option value="subscription">اشتراك وانضمام لقنوات ومستندات (Subscription)</option>
                                <option value="view">مشاهدات فيديوهات وتصفح حقيقي زمني (View)</option>
                                <option value="like">تفاعلات لايك، ريتويت وإعجاب (Like)</option>
                                <option value="follow">متابعة وزيادة معجبين وفولو (Follow)</option>
                                <option value="other">أخرى / مهمة وتحدي رقمي مخصص (Custom)</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-350 mb-1">الكمية المستهدفة / الموازنة:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editingTaskQuantity}
                                  onChange={(e) => setEditingTaskQuantity(Math.max(1, Number(e.target.value)))}
                                  className="w-full px-2 py-2 bg-slate-900 border border-slate-800 text-xs text-center text-white rounded-lg font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-350 mb-1">نقاط الخصم (تكلفة):</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editingTaskPoints}
                                  onChange={(e) => setEditingTaskPoints(Math.max(1, Number(e.target.value)))}
                                  className="w-full px-2 py-2 bg-slate-900 border border-slate-800 text-xs text-center text-amber-500 rounded-lg font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-350 mb-1">نقاط الجائزة (للعضو):</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={editingTaskReward}
                                  onChange={(e) => setEditingTaskReward(Math.max(1, Number(e.target.value)))}
                                  className="w-full px-2 py-2 bg-slate-900 border border-slate-800 text-xs text-center text-indigo-400 rounded-lg font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                              <label className="flex items-center gap-2 cursor-pointer bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                <input
                                  type="checkbox"
                                  checked={editingTaskFeatured}
                                  onChange={(e) => setEditingTaskFeatured(e.target.checked)}
                                  className="w-4 h-4 text-indigo-650 rounded border-slate-800 bg-slate-900"
                                />
                                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  التمييز: تعيين كمهمة مميزة ومثبتة (Featured ⭐️) بمكافأة كبرى
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                            <button
                              type="button"
                              onClick={() => setEditingTaskId(null)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg transition"
                            >
                              إلغاء التعديل
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditedTaskCampaign(camp.id)}
                              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                            >
                              <Save className="w-4 h-4" />
                              <span>حفظ وتحديث التغييرات فوراً</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1 w-full min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-black text-white bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                                {plat?.name || 'منصة مخصصة'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">معرف المهمة: {camp.id}</span>
                              {camp.isFeatured && (
                                <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                                  مميزة ومثبتة 🔥
                                </span>
                              )}
                              <span className="text-[9.5px] bg-slate-900 text-indigo-400 border border-slate-800 px-2 py-0.5 rounded font-bold">
                                {camp.taskType === 'subscription' ? 'اشتراك وانضمام لقنوات' :
                                 camp.taskType === 'view' ? 'مشاهدة وتصفح زمني' :
                                 camp.taskType === 'like' ? 'تفاعلات لايك وإعجاب' :
                                 camp.taskType === 'follow' ? 'متابعة وزيادة معجبين' :
                                 'تفاعل مخصص عام'}
                              </span>
                              {camp.creatorId === 'admin_sys' && (
                                <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-bold">
                                  رعاية الموقع ⭐️
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs md:text-sm font-extrabold text-slate-200 truncate flex items-center gap-1.5">
                              {camp.title}
                            </h4>
                            <p className="text-[10.5px] text-slate-500 font-mono truncate" dir="ltr">{camp.youtubeUrl}</p>
                          </div>

                          <div className="flex items-center gap-5 flex-wrap md:justify-end w-full md:w-auto">
                            <div className="text-center min-w-[100px] mx-auto md:mx-0">
                              <span className="block text-[9px] text-slate-550 mb-1 font-bold">عدد الإعلانات وتتبع الطلبات</span>
                              <div className="font-mono text-xs text-slate-300 flex items-center justify-center gap-1 font-black mb-1">
                                <span>{camp.completedCount}</span>
                                <span className="text-slate-600">/</span>
                                <span>{camp.quantity}</span>
                              </div>
                              <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850 mx-auto">
                                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(100, progress)}%` }}></div>
                              </div>
                            </div>

                            <div className="flex gap-4 text-center justify-center mx-auto md:mx-0">
                              <div>
                                <span className="block text-[9px] text-slate-550 mb-0.5 font-bold">خصوم التفاعل</span>
                                <span className="font-mono text-xs font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">{camp.pointsPerAction} ن</span>
                              </div>
                              <div>
                                <span className="block text-[9px] text-slate-550 mb-0.5 font-bold">جائزة الزائر</span>
                                <span className="font-mono text-xs font-black text-indigo-400 bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-500/10">{camp.rewardPerAction || Math.round(camp.pointsPerAction * 0.8)} ن</span>
                              </div>
                              <div>
                                <span className="block text-[9px] text-slate-550 mb-0.5 font-bold">الحالة</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded block ${camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : camp.status === 'completed' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                                  {camp.status === 'active' ? 'نشط' : camp.status === 'completed' ? 'مكتمل' : 'موقوف'}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-1 justify-center mx-auto md:mx-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditingTaskCampaign(camp)}
                                className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                                title="تعديل تفاصيل الإعلانات والنقاط والنشاط للمهمة"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  db.toggleCampaignStatus(camp.id);
                                  if (typeof onAdminActionDone === 'function') {
                                    onAdminActionDone();
                                  }
                                }}
                                className={`p-2 rounded-xl transition cursor-pointer border ${
                                  camp.status === 'active'
                                    ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-white text-amber-500'
                                    : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-400'
                                }`}
                                title={camp.status === 'active' ? "إيقاف مؤقت" : "تشغيل"}
                              >
                                {camp.status === 'active' ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 animate-none" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('هل تريد فعلاً حذف وإخفاء هذه المهمة نهائياً من العروض؟')) {
                                    db.deleteCampaign(camp.id);
                                    if (typeof onAdminActionDone === 'function') {
                                      onAdminActionDone();
                                    }
                                  }
                                }}
                                className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 hover:border-red-600 rounded-xl transition cursor-pointer"
                                title="حذف المهمة نهائياً"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
