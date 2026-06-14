import React, { useState } from 'react';
import { db } from '../lib/db';
import { User, WithdrawalRequest } from '../types';
import { Coins, Wallet, History, ArrowDownLeft, ShieldCheck, Check, Info, PhoneCall, QrCode } from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface WithdrawPointsProps {
  user: User;
  onExchanged: () => void;
  lang?: string;
}

const wTrans: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    badgeName: 'استبدال نقاطك الترويرية',
    mainTitle: 'تحويل النقاط إلى سحب كاش',
    availablePoints: 'نقاط حسابك المتاحة',
    pointsCount: '{count} نقطة',
    step1Header: '1. حدد الباقة الموازية لنقاطك حالياً لتتمكن من تفعيل السحب:',
    bronzeLevel: 'مستوى برونزي',
    silverLevel: 'مستوى فضي',
    goldLevel: '🔥 مستوى ذهبي (مكافأة +$1)',
    championLevel: '💎 مستوى بطل المنصة (مكافأة +$2)',
    btnAction: 'ضغط الاستبدال والسحب المباشر ⚡',
    btnPointsInsuff: 'النقاط المتوفرة غير كافية',
    payoutVal: 'القيمة المضافة: ${val} دولارات أمريكية',
    step2Header: '2. حدد وسيلة السحب المفضلة لاستلام أرباحك الحالية:',
    mobileCashLabel: 'فودافون كاش والمحافظ الرقمية المحلية:',
    cryptoLabel: 'الاستلام عبر العملات الرقمية والشبكات العالمية:',
    payoutPhoneLabel: 'أدخل رقم هاتف المحفظة المستلم بالكامل للتحويل:',
    payoutWalletLabel: 'أدخل عنوان محفظة {gateway} بدقة لاستلام حصتك:',
    walletPhonePlaceholder: 'اكتب رقم فودافون كاش الخاص بك بدقة مثل 010xxxxxxxxx',
    walletAddressPlaceholder: 'ألصق عنوان محفظة {gateway} الشخصانية بدقة متناهية هنا',
    step3Header: '3. مراجعة وتأكيد طلب السحب الفعلي:',
    submitBtn: 'تأكيد السحب الفوري للنقاط',
    infoTip: 'ℹ️ بعد الضغط على أي باقة مستوفاة، تخصم النقاط وتدخل قيد مراجعة الإدارة للتحويل الفوري.',
    assuranceTitle: 'سحوبات سريعة فائقة الأمان',
    assuranceDesc: 'تقوم الإدارة بمطابقة الطلب في وقت قياسي يتراوح بين 10 دقائق إلى ساعتين وإرسال الكاش فوراً.',
    historyHeader: 'سجل تحويل النقاط المجمعة',
    noHistoryDesc: 'لم تقم بطلب تحويل نقاط مسبقاً في حسابك حتى الآن.',
    thSize: 'باقة النقاط',
    thCost: 'قيمة المستحق',
    thGateway: 'وسيلة الدفع',
    thWallet: 'المحفظة / الهاتف المستهدف',
    thDate: 'تاريخ الإرسال',
    thStatus: 'الحالة',
    statusApproved: 'تمت الموافقة والدفع ✅',
    statusRejected: 'مرفوض - تم رد نقاطك ❌',
    statusPending: 'قيد المراجعة الفورية 🕒',
    mobileVodafone: 'فودافون كاش',
    mobileEtisalat: 'اتصالات كاش',
    mobileOrange: 'أورنج كاش',
    mobileWe: 'وي كاش',
    mobileInstapay: 'إنستا باي InstaPay',
    insuffPointsError: '⚠️ رصيد نقاطك الحالي ({count} نقطة) غير كافٍ لإتمام هذا التبادل! تحتاج إلى تشغيل المزيد من حملات المشاهدة/الاشتراك أولاً.',
    destRequiredError: '⚠️ يرجى إدخال رقم الهاتف المحول إليه أو عنوان المحفظة الشخصية المستهدفة أولاً!',
    destInvalidError: '⚠️ يرجى كتابة بيانات صحيحة وكاملة لاستلام أرباحك (رقم موبايل الكاش أو عنوان محفظة رقمية صالح)',
    successSubmitMsg: '🚀 تم إرسال طلب تبادل {points} نقطة مقابل ${dollars} بنجاح! تم خصم النقاط وهو الآن قيد مراجعة الإدارة للتحويل الفوري.'
  },
  en: {
    badgeName: 'Redeem Promotional Points',
    mainTitle: 'Convert points to Cash Withdrawal',
    availablePoints: 'Your Available Points',
    pointsCount: '{count} pts',
    step1Header: '1. Select the tier below matching your current points to trigger payout:',
    bronzeLevel: 'Bronze Level',
    silverLevel: 'Silver Level',
    goldLevel: '🔥 Gold Level (Bonus +$1)',
    championLevel: '💎 Platform Champion (Bonus +$2)',
    btnAction: 'Click to convert & Cashout ⚡',
    btnPointsInsuff: 'Insufficient Points',
    payoutVal: 'Payout: ${val} USD Dollars',
    step2Header: '2. Select your preferred payout method of choice:',
    mobileCashLabel: 'Vodafone Cash & Local Mobile Wallets:',
    cryptoLabel: 'Global Cryptocurrencies & Blockchains:',
    payoutPhoneLabel: 'Enter your recipient mobile wallet number:',
    payoutWalletLabel: 'Enter your {gateway} recipient wallet address exactly:',
    walletPhonePlaceholder: 'Write your cash mobile number accurately (e.g., 01xxxxxxxxx)',
    walletAddressPlaceholder: 'Paste destination {gateway} address accurately here',
    step3Header: '3. Review and Confirm Cashout Process:',
    submitBtn: 'Confirm Instant Points Cashout',
    infoTip: 'ℹ️ Deduct points instantly and queue of review upon picking any applicable point tier below.',
    assuranceTitle: 'Highly secure payout execution',
    assuranceDesc: 'Our administrative audit matches transactions in record time, routing payouts within 10 minutes to 2 hours maximum.',
    historyHeader: 'Promotional Points Cashout Log',
    noHistoryDesc: 'No point liquidation requests logged on your account yet.',
    thSize: 'Points exchange',
    thCost: 'Cashout value',
    thGateway: 'Payout gateway',
    thWallet: 'Destination mobile / Wallet',
    thDate: 'Logged date',
    thStatus: 'Verification Status',
    statusApproved: 'Approved & Paid ✅',
    statusRejected: 'Rejected - Points Refunded ❌',
    statusPending: 'Under instant verification 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay',
    insuffPointsError: '⚠️ Your current balance ({count} Points) is insufficient! Complete more tasks to accumulate supports points first.',
    destRequiredError: '⚠️ Recipient mobile phone number or wallet address is mandatory to complete request!',
    destInvalidError: '⚠️ Please enter valid information to route rewards (6 digits minimum for wallets/numbers)',
    successSubmitMsg: '🚀 Conversion of {points} points to ${dollars} initiated! Deducted points queued for review.'
  },
  fr: {
    badgeName: 'Racheter les Points de Promotion',
    mainTitle: 'Liquider les Points collectés',
    availablePoints: 'Points disponibles',
    pointsCount: '{count} Pts',
    step1Header: '1. Choisissez un niveau ci-dessous pour liquider vos points:',
    bronzeLevel: 'Niveau Bronze',
    silverLevel: 'Niveau Argent',
    goldLevel: '🔥 Niveau Or (Bonus +1$)',
    championLevel: '💎 Champion du Site (Bonus +2$)',
    btnAction: 'Convertir & Retirer immédiatement ⚡',
    btnPointsInsuff: 'Points insuffisants',
    payoutVal: 'Paiement: ${val} USD',
    step2Header: '2. Choisissez la passerelle de réception de votre choix:',
    mobileCashLabel: 'Vodafone Cash & Portefeuilles locaux égyptiens:',
    cryptoLabel: 'Cryptomonnaies & Réseaux Blockchain globaux:',
    payoutPhoneLabel: 'Numéro de réception mobile local:',
    payoutWalletLabel: 'Adresse de réception {gateway}:',
    walletPhonePlaceholder: 'Exemple: 01xxxxxxxxx',
    walletAddressPlaceholder: 'Collez l\'adresse {gateway} destinataire avec le plus grand soin',
    step3Header: '3. Finalisation du retrait:',
    submitBtn: 'Demander le Retrait Immédiat',
    infoTip: 'ℹ️ La sélection d\'une formule décompte instantanément vos points pour audit administratif avant envoi.',
    assuranceTitle: 'Retraits de fonds audités et sécurisés',
    assuranceDesc: 'Le traitement prend de 10 minutes à un maximum de 2 heures.',
    historyHeader: 'Historique de Liquidation de Points',
    noHistoryDesc: 'Aucune opération de rachat de points inscrite au compte.',
    thSize: 'Volume Points',
    thCost: 'Montant Liquidé',
    thGateway: 'Passerelle',
    thWallet: 'Cible de réception',
    thDate: 'Emis le',
    thStatus: 'Statut Virement',
    statusApproved: 'Payé & Approuvé ✅',
    statusRejected: 'Rejeté - Points Restitués ❌',
    statusPending: 'En attente d\'examen 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay',
    insuffPointsError: '⚠️ Échec: Points disponibles ({count} Pts) insuffisants!',
    destRequiredError: '⚠️ Adresse de destination ou numéro d\'expéditeur obligatoire!',
    destInvalidError: '⚠️ Veuillez fournir des informations de routage valides pour votre paiement.',
    successSubmitMsg: '🚀 Demande reçue! Échange de {points} points contre ${dollars} envoyé à l\'équipe de virement.'
  },
  es: {
    badgeName: 'Canjear Puntos de Promoción',
    mainTitle: 'Convertir Puntos en Pago Efectivo',
    availablePoints: 'Puntos de Cuenta Disponibles',
    pointsCount: '{count} Pts',
    step1Header: '1. Seleccione la escala de puntos correspondiente para retirar saldo:',
    bronzeLevel: 'Escala Bronce',
    silverLevel: 'Escala Plata',
    goldLevel: '🔥 Escala Oro (Bonus +$1)',
    championLevel: '💎 Escala Campeón (Bonus +$2)',
    btnAction: 'Presionar para Canjear y Retirar ⚡',
    btnPointsInsuff: 'Puntos Insuficientes',
    payoutVal: 'Valor a Cancelar: ${val} USD',
    step2Header: '2. Seleccione el monedero para recibir su dinero:',
    mobileCashLabel: 'Vodafone Cash y Monederos locales de telefonía:',
    cryptoLabel: 'Billeteras de Criptomonedas / Redes Blockchain:',
    payoutPhoneLabel: 'Identificador o número móvil del cobro:',
    payoutWalletLabel: 'Dirección receptora de la red {gateway}:',
    walletPhonePlaceholder: 'Escriba su número Vodafone Cash (e.g., 01xxxxxxxxx)',
    walletAddressPlaceholder: 'Pegue su clave pública de la red {gateway} detenidamente',
    step3Header: '3. Validar y Confirmar Proceso de Retiro:',
    submitBtn: 'Confirmar Retiro Inmediato de Puntos',
    infoTip: 'ℹ️ Los puntos se deducen del balance de inmediato y se encolan para la revisión del equipo.',
    assuranceTitle: 'Procesamiento de pagos auditado y seguro',
    assuranceDesc: 'La verificación manual demora típicamente entre 10 minutos y 2 horas máximo.',
    historyHeader: 'Registro de Canjes de Puntos Procesados',
    noHistoryDesc: 'Aún no se registran transferencias de puntos a cuentas en su historial.',
    thSize: 'Canje de Puntos',
    thCost: 'Monto Recibido',
    thGateway: 'Servicio de Pago',
    thWallet: 'Destinatario de Fondos',
    thDate: 'Creado el',
    thStatus: 'Estado de Pago',
    statusApproved: 'Retiro Aprobado y Pagado ✅',
    statusRejected: 'Rechazado - Puntos Reintegrados ❌',
    statusPending: 'Aprobación en Progreso 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay',
    insuffPointsError: '⚠️ ¡Puntos insuficientes! Su balance actual ({count}) es menor que el valor requerido.',
    destRequiredError: '⚠️ ¡Es obligatorio proveer una dirección destino o número móvil para el cobro!',
    destInvalidError: '⚠️ Por favor introduzca datos coherentes y válidos para dirigir sus fondos.',
    successSubmitMsg: '🚀 ¡Redención de {points} puntos por ${dollars} enviada para validación!'
  }
};

export default function WithdrawPoints({ user, onExchanged, lang = 'en' }: WithdrawPointsProps) {
  const [exchangeRate, setExchangeRate] = useState<number>(50000);
  const [selectedMethod, setSelectedMethod] = useState<'BTC' | 'ETH' | 'DOGE' | 'TRX' | 'USDT' | 'VF_CASH' | 'ET_CASH' | 'OR_CASH' | 'WE_CASH' | 'INSTAPAY'>('VF_CASH');
  const [walletOrPhoneInput, setWalletOrPhoneInput] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = wTrans[activeLang];

  const adminSettings = db.getAdminSettings();
  const allWithdrawals = db.getWithdrawals().filter(w => w.userId === user.uid);

  const rates = [
    { points: 50000, dollars: 1, label: t.bronzeLevel },
    { points: 100000, dollars: 2, label: t.silverLevel },
    { points: 150000, dollars: 4, label: t.goldLevel },
    { points: 200000, dollars: 6, label: t.championLevel },
  ];

  const handleExchange = (points: number, dollars: number) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Initial validations
    if (user.points < points) {
      setErrorMsg(t.insuffPointsError.replace('{count}', user.points.toLocaleString()));
      return;
    }

    if (!walletOrPhoneInput.trim()) {
      setErrorMsg(t.destRequiredError);
      return;
    }

    if (walletOrPhoneInput.trim().length < 6) {
      setErrorMsg(t.destInvalidError);
      return;
    }

    // Process withdrawal
    db.submitWithdrawal({
      userId: user.uid,
      userEmail: user.email,
      pointsExchanged: points,
      dollarsEarned: dollars,
      method: selectedMethod,
      walletOrPhone: walletOrPhoneInput.trim()
    });

    setSuccessMsg(t.successSubmitMsg.replace('{points}', points.toLocaleString()).replace('{dollars}', dollars.toString()));
    setWalletOrPhoneInput('');
    onExchanged();

    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'BTC': return 'Bitcoin BTC';
      case 'ETH': return 'Ethereum ETH';
      case 'DOGE': return 'Dogecoin DOGE';
      case 'TRX': return 'Tron TRX';
      case 'USDT': return 'Tether USDT';
      case 'VF_CASH': return t.mobileVodafone;
      case 'ET_CASH': return t.mobileEtisalat;
      case 'OR_CASH': return t.mobileOrange;
      case 'WE_CASH': return t.mobileWe;
      case 'INSTAPAY': return t.mobileInstapay;
      default: return method;
    }
  };

  const isLocalCash = (method: string) => {
    return ['VF_CASH', 'ET_CASH', 'OR_CASH', 'WE_CASH', 'INSTAPAY'].includes(method);
  };

  const getStatusStyle = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'rejected') return 'text-red-400 bg-red-400/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return t.statusApproved;
    if (status === 'rejected') return t.statusRejected;
    return t.statusPending;
  };

  return (
    <div className={`w-full font-sans max-w-5xl mx-auto ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8 flex-row">
        <span className="text-xs font-bold text-red-450 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
          {t.badgeName}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-row">
          {t.mainTitle}
          <Wallet className="w-6 h-6 text-red-500" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Points Conversion */}
        <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between bg-slate-950 p-5 rounded-2xl border border-slate-850 flex-row">
            <span className="font-mono text-xl font-black text-amber-500">{t.pointsCount.replace('{count}', user.points.toLocaleString())}</span>
            <span className="text-xs font-black text-slate-400 block">{t.availablePoints}</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-300">
              {t.step1Header}
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-bold font-sans">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-400/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold font-sans">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((rate) => {
                const canAfford = user.points >= rate.points;
                return (
                  <button
                    id={`rates-item-${rate.points}`}
                    key={rate.points}
                    disabled={!canAfford}
                    onClick={() => handleExchange(rate.points, rate.dollars)}
                    className={`p-5 rounded-2xl border text-right transition flex flex-col justify-between gap-3 relative overflow-hidden ${
                      canAfford
                        ? 'bg-slate-950/40 hover:bg-emerald-550/5 border-slate-850 hover:border-emerald-500 cursor-pointer'
                        : 'bg-slate-950/70 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full flex-row">
                      <div className="text-left font-sans">
                        <p className="text-lg font-black text-emerald-400">{t.payoutVal.replace('{val}', rate.dollars.toString())}</p>
                        <span className="text-[10px] text-slate-500 block">≈ {rate.dollars * 50} EGP</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-black block mb-1">{rate.label}</span>
                        <p className="text-base font-mono font-black text-slate-250">{rate.points.toLocaleString()} pts</p>
                      </div>
                    </div>

                    <div className="w-full pt-2 border-t border-slate-850/60 flex justify-between items-center text-xs flex-row">
                      <span className={canAfford ? 'text-emerald-400 font-extrabold' : 'text-slate-600'}>
                        {canAfford ? t.btnAction : t.btnPointsInsuff}
                      </span>
                      <span className="text-slate-500 font-mono">Value: <strong className="text-white">${rate.dollars}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-[1px] bg-slate-800"></div>

          {/* Step 2: Selecting Destination payout Method */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-300">
              {t.step2Header}
            </h3>

            <div className="space-y-6">
              <div>
                <span className="block text-[11px] text-slate-500 font-extrabold uppercase mb-2">{t.mobileCashLabel}</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-row">
                  {[
                    { key: 'VF_CASH', label: t.mobileVodafone },
                    { key: 'ET_CASH', label: 'Etisalat' },
                    { key: 'OR_CASH', 'label': 'Orange' },
                    { key: 'WE_CASH', label: 'We Cash' },
                    { key: 'INSTAPAY', label: 'InstaPay' }
                  ].map((gateway) => (
                    <button
                      id={`gateway-select-${gateway.key}`}
                      key={gateway.key}
                      onClick={() => setSelectedMethod(gateway.key as any)}
                      className={`py-2 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        selectedMethod === gateway.key
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-extrabold'
                          : 'bg-slate-950 border-slate-855 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {gateway.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-slate-500 font-extrabold uppercase mb-2">{t.cryptoLabel}</span>
                <div className="grid grid-cols-5 gap-2 flex-row">
                  {(['USDT', 'BTC', 'ETH', 'TRX', 'DOGE'] as any).map((coin: string) => (
                    <button
                      id={`gateway-select-${coin}`}
                      key={coin}
                      onClick={() => setSelectedMethod(coin as any)}
                      className={`py-2 rounded-xl border text-center font-bold font-mono text-sm transition cursor-pointer ${
                        selectedMethod === coin
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-extrabold'
                          : 'bg-slate-950 border-slate-800 text-slate-404 hover:border-slate-705'
                      }`}
                    >
                      {coin}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Target address input field */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                {isLocalCash(selectedMethod)
                  ? t.payoutPhoneLabel
                  : t.payoutWalletLabel.replace('{gateway}', selectedMethod)}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={walletOrPhoneInput}
                  onChange={(e) => setWalletOrPhoneInput(e.target.value)}
                  placeholder={isLocalCash(selectedMethod) 
                    ? t.walletPhonePlaceholder 
                    : t.walletAddressPlaceholder.replace('{gateway}', selectedMethod)}
                  className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-550 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-800"></div>

          {/* Tips Summary section */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/60 leading-normal text-slate-400 text-xs text-right flex items-start gap-2 flex-row">
            <Info className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>{t.infoTip}</span>
          </div>

        </div>
      </div>

      {/* Buying History List Section */}
      <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2 justify-start flex-row">
          <History className="w-5 h-5 text-slate-400" />
          <span>{t.historyHeader}</span>
        </h3>

        {allWithdrawals.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-850">
            <p className="text-xs text-slate-500">{t.noHistoryDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs">
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thSize}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thCost}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thGateway}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thWallet}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thDate}</th>
                  <th className="py-3 px-4 font-semibold text-center">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {allWithdrawals.map((pay) => (
                  <tr key={pay.id} className="text-slate-300">
                    <td className="py-3.5 px-4 font-bold text-white text-right">{pay.pointsExchanged.toLocaleString()} pts</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 text-right">${pay.dollarsEarned}</td>
                    <td className="py-3.5 px-4 font-bold text-xs text-right text-slate-200">
                      {getMethodLabel(pay.method)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs">{pay.walletOrPhone}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 text-right">
                      {new Date(pay.createdAt).toLocaleDateString(activeLang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`px-2.5 py-1 text-center rounded-lg border text-xs font-bold ${getStatusStyle(pay.status)}`}>
                        {getStatusText(pay.status)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
