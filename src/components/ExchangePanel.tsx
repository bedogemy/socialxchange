import React, { useState } from 'react';
import { db } from '../lib/db';
import { User, WithdrawalRequest } from '../types';
import { 
  Coins, 
  Wallet, 
  History, 
  ArrowDownLeft, 
  CheckCircle, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  HelpingHand
} from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface ExchangePanelProps {
  user: User;
  onExchangeDone: () => void;
  lang?: string;
}

const exchgTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    mainTitle: 'تبديل النقاط وسحب الأرباح',
    mainDesc: 'حول نقاط التفاعل الخاصة بك إلى رصيد دولارات، ثم اسحب كاش وفودافون كاش ومحافظ رقمية صالحة بالثواني',
    availablePoints: 'نقاط الحساب المتوفرة',
    availableDollars: 'رصيد دولاراتك المتاح للسحب',
    pointsToUsdHeader: '1. تحويل النقاط المجمعة لـ دولار',
    pointsToUsdDesc: 'اضغط على باقة النقاط أدناه المناسبة لرصيدك. ستقوم الإدارة بمراجعة المجهود والنقاط وتفعيل الأرباح في رصيدك بالدولار فوراً ومباشرة.',
    insuffPointsAlert: '⚠️ رصيد نقاطك الحالي ({count} نقطة) غير كافٍ للتبديل! اجمع نقاط إضافية عن طريق تنفيذ مهام المنصات الرقمية.',
    directPointsExchg: 'طلب استبدال نقاط مباشر',
    exchangeSentSuccess: '🚀 تم إرسال طلب تحويل {points} نقطة إلى ${dollars} بنجاح! تم خصم النقاط فوراً وجاري المراجعة والإضافة بعد موافقة الإدارة.',
    pointsInfoTip: 'ℹ️ بعد الضغط، تخصم النقاط وتدخل قيد مراجعة الإدارة. تذكر أن 50 ألف نقطة تعادل 1 دولار في النظام.',
    sendCashoutHeader: '2. سحب رصيد الدولار كاش وأرباح',
    sendCashoutDesc: 'اختر وسيلتك المحركية المفضلة (كاش محلي أو عملات رقمية)، واكتب بيانات المحفظة ثم اضغط على زر السحب لبدء الصرف.',
    invalidAmountAlert: '⚠️ يرجى إدخال مبلغ سحب صحيح بالدولار أكبر من صفر!',
    insuffUsdAlert: '⚠️ رصيد دولاراتك المتاحة الحالي (${current}) غير كافٍ لسحب هذا المبلغ (${req})!',
    destRequiredAlert: '⚠️ يرجى إدخال رقم الهاتف لاستلام الكاش أو عنوان محفظتك لاستقبال الرصيد!',
    invalidDestAlert: '⚠️ يرجى كتابة بيانات استلام كاملة وصحيحة تتوافق مع نظام البوابة المحددة!',
    withdrawSuccessAlert: '💸 تم تقديم طلب سحب ${amount} بنجاح وخصمه من حسابك! سيتم المراجعة والإرسال الفوري لبيانات الدفع عبر الإدارة.',
    requestedAmountLabel: 'مبلغ السحب المطلوب بالدولار ($):',
    maxAvailableLabel: 'الحد الأقصى المتاح: ${max}',
    fullUsdBalanceLabel: 'رصيد دولاراتك المتاح بالكامل: ${max} (تساوي تقريباً {egp} ج.م)',
    mobileCashLabel: 'فودافون كاش والمحافظ المحلية:',
    cryptoLabel: 'الشبكات والعملات المشفرة:',
    phoneTargetLabel: 'رقم الكاش المستهدف أو الهاتف المستلم:',
    walletAddressLabel: 'عنوان محفظة {gateway} الشخصية لاستلام العملة:',
    phonePlaceholder: 'اكتب رقم فودافون كاش أو رقم محفظتك الشخصية هنا',
    walletPlaceholder: 'ألصق عنوان محفظة {gateway} الشخصية هنا بدقة',
    submitWithdrawBtn: 'تأكيد تقديم طلب سحب الأرباح',
    ledgerHeader: 'سجل العمليات وطلبات الاستبدال والسحب الفردية',
    noLedgerMessage: 'لم تقم ببدء أي عملية تحويل نقاط أو سحب أرباح من البوابات مؤخراً.',
    thType: 'نوع العملية',
    thPoints: 'النقاط المستهلكة',
    thCash: 'قيمة الكاش',
    thInfo: 'بوابة التحويل / البيانات',
    thTime: 'التوقيت',
    thStatus: 'حالة الطلب ومراجعته',
    cashoutLabel: 'سحب كاش 💸',
    pointsExchgLabel: 'تبديل نقاط 🔄',
    pPointsExchg: 'استبدال نقاط الحساب لـUSD',
    bronzeTier: 'مستوى برونزي',
    silverTier: 'مستوى فضي',
    goldTier: '🔥 مستوى ذهبي (مكافأة +$1)',
    championTier: '💎 بطل المنصة (مكافأة +$2)',
    btnRequestExchg: 'اضغط لطلب التحويل ⚡',
    btnPointsInsuff: 'النقاط غير كافية',
    valLabel: 'القيمة:',
    approvedStatus: 'معتمد ومؤكد ✅',
    rejectedStatus: 'مرفوض - مسترد ❌',
    pendingStatus: 'قيد مراجعة الإدارة 🕒',
    mobileVodafone: 'فودافون كاش',
    mobileEtisalat: 'اتصالات كاش',
    mobileOrange: 'أورنج كاش',
    mobileWe: 'وي كاش',
    mobileInstapay: 'إنستا باي InstaPay'
  },
  en: {
    mainTitle: 'Points Exchange & USD Cashout',
    mainDesc: 'Convert points into dollar balance, then cash out securely to local vodafone cash or crypto wallets in seconds.',
    availablePoints: 'Available Points',
    availableDollars: 'Available USD Balance',
    pointsToUsdHeader: '1. Convert Points to USD Dollars',
    pointsToUsdDesc: 'Click a tier below to submit points for conversion. USD is credited to your balance upon admin verification.',
    insuffPointsAlert: '⚠️ Your current balance ({count} Points) is insufficient to exchange! Collect more points by cooperating with digital services.',
    directPointsExchg: 'Direct Points Conversion Request',
    exchangeSentSuccess: '🚀 Conversion of {points} points to ${dollars} sent for review! Deducted.',
    pointsInfoTip: 'ℹ️ Points are deducted instantly and locked until approved. 50,000 points equals $1 in our valuation.',
    sendCashoutHeader: '2. Send USD Cash Out Withdrawal',
    sendCashoutDesc: 'Submit a withdrawal form to receive your dollar earnings directly to your mobile wallet or crypto address.',
    invalidAmountAlert: '⚠️ Please enter a valid USD withdrawal amount!',
    insuffUsdAlert: '⚠️ Your available USD balance is only ${current} for this withdrawal of ${req}!',
    destRequiredAlert: '⚠️ Destination address or mobile wallet number is required!',
    invalidDestAlert: '⚠️ Invalid format for destination payout details!',
    withdrawSuccessAlert: '💸 Withdrawal request of ${amount} submitted! Pending admin payout.',
    requestedAmountLabel: 'Requested USD Payout Amount:',
    maxAvailableLabel: 'Max: ${max}',
    fullUsdBalanceLabel: 'Your full available dollar balance: ${max} (approx. {egp} EGP)',
    mobileCashLabel: 'Mobile Cash / Local options:',
    cryptoLabel: 'Crypto currency options:',
    phoneTargetLabel: 'Cah / Wallet mobile number:',
    walletAddressLabel: '{gateway} Destination Wallet Address:',
    phonePlaceholder: 'Write Vodafone Cash or target mobile number here',
    walletPlaceholder: 'Paste destination {gateway} address accurately',
    submitWithdrawBtn: 'Submit USD Withdrawal Request',
    ledgerHeader: 'Transactions & Exchange Log History',
    noLedgerMessage: 'No transactions recorded on your public ledger account.',
    thType: 'Transaction Type',
    thPoints: 'Spent Points',
    thCash: 'Cash Value',
    thInfo: 'Gateway / Destination Info',
    thTime: 'Time',
    thStatus: 'Approval Status',
    cashoutLabel: 'Cash Out 💸',
    pointsExchgLabel: 'Points Exchange 🔄',
    pPointsExchg: 'Points to USD Conversion',
    bronzeTier: 'Bronze Level',
    silverTier: 'Silver Level',
    goldTier: '🔥 Gold Level (Bonus +$1)',
    championTier: '💎 Platform Champion (Bonus +$2)',
    btnRequestExchg: 'Click to convert ⚡',
    btnPointsInsuff: 'Insufficient Points',
    valLabel: 'Value:',
    approvedStatus: 'Approved & Paid ✅',
    rejectedStatus: 'Rejected - Refunded ❌',
    pendingStatus: 'Under Admin Review 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  },
  fr: {
    mainTitle: 'Échange de Points & Retrait USD',
    mainDesc: 'Convertissez vos points en dollars puis retirez vos fonds en liquide ou cryptomonnaie en quelques secondes.',
    availablePoints: 'Points Disponibles',
    availableDollars: 'Solde USD Retirable',
    pointsToUsdHeader: '1. Convertir les points en USD',
    pointsToUsdDesc: 'Cliquez sur un niveau ci-dessous pour soumettre vos points à la conversion. Le USD sera crédité après révision de l\'administrateur.',
    insuffPointsAlert: '⚠️ Votre solde de points ({count} points) est insuffisant! Regagnez de nouveaux points en accomplissant des actions.',
    directPointsExchg: 'Demande de conversion de points',
    exchangeSentSuccess: '🚀 Demande d\'échange de {points} points contre ${dollars} envoyée avec succès!',
    pointsInfoTip: 'ℹ️ Les points sont déduits instantanément. 50 000 points équivalent à 1 USD dans notre barème de calcul.',
    sendCashoutHeader: '2. Demander un retrait de fonds USD',
    sendCashoutDesc: 'Saisissez les informations requises pour virer vos gains USD directement vers un portefeuille mobile ou crypto.',
    invalidAmountAlert: '⚠️ Veuillez spécifier un montant de retrait valide!',
    insuffUsdAlert: '⚠️ Votre solde retirable (${current}) est inférieur au montant demandé (${req})!',
    destRequiredAlert: '⚠️ Numéro de téléphone ou adresse de crypto-portefeuille obligatoire!',
    invalidDestAlert: '⚠️ Format d\'adresse de destination non reconnu!',
    withdrawSuccessAlert: '💸 Retrait de ${amount} enregistré! Traitement administratif en cours.',
    requestedAmountLabel: 'Montant de retrait en USD ($):',
    maxAvailableLabel: 'Maximum: ${max}',
    fullUsdBalanceLabel: 'Votre solde USD total: ${max} (environ {egp} EGP)',
    mobileCashLabel: 'Portefeuilles mobiles locaux:',
    cryptoLabel: 'Réseaux de cryptomonnaies:',
    phoneTargetLabel: 'Numéro de réception mobile:',
    walletAddressLabel: 'Adresse de réception {gateway}:',
    phonePlaceholder: 'Entrez votre numéro Vodafone Cash ou autre portefeuille ici',
    walletPlaceholder: 'Collez l\'adresse {gateway} avec la plus grande exactitude',
    submitWithdrawBtn: 'Confirmer le Retrait USD',
    ledgerHeader: 'Historiques des Transactions & Échanges',
    noLedgerMessage: 'Aucune transaction enregistrée sur votre compte récemment.',
    thType: 'Type de Transaction',
    thPoints: 'Points Consommés',
    thCash: 'Valeur Payout',
    thInfo: 'Passerelle / Destination',
    thTime: 'Date',
    thStatus: 'Statut du Paiement',
    cashoutLabel: 'Retrait Retenu 💸',
    pointsExchgLabel: 'Échange de Points 🔄',
    pPointsExchg: 'Rachat de Points en USD',
    bronzeTier: 'Niveau Bronze',
    silverTier: 'Niveau Argent',
    goldTier: '🔥 Niveau Or (Bonus +1$)',
    championTier: '💎 Champion du Site (Bonus +2$)',
    btnRequestExchg: 'Cliquez pour convertir ⚡',
    btnPointsInsuff: 'Points insuffisants',
    valLabel: 'Valeur:',
    approvedStatus: 'Validé & Payé ✅',
    rejectedStatus: 'Rejeté - Restitué ❌',
    pendingStatus: 'En cours d\'examen 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  },
  es: {
    mainTitle: 'Intercambio de Puntos y Retiro USD',
    mainDesc: 'Transforme sus puntos de interacción en dólares, luego retire sus ganancias a monederos locales o billeteras de criptomonedas de inmediato.',
    availablePoints: 'Puntos de la Cuenta',
    availableDollars: 'Saldo USD Disponible',
    pointsToUsdHeader: '1. Convertir Puntos en Dólares USD',
    pointsToUsdDesc: 'Seleccione un nivel para procesar la deducción de puntos. El saldo se acreditará tras la aprobación del administrador.',
    insuffPointsAlert: '⚠️ ¡Sus puntos acumulados ({count} pts) son insuficientes para canje! Multiplique su saldo cooperando en tareas del portal.',
    directPointsExchg: 'Solicitud directa de canje de puntos',
    exchangeSentSuccess: '🚀 ¡Solicitud de {points} puntos por ${dollars} enviada para validación con éxito!',
    pointsInfoTip: 'ℹ️ Los puntos se descuentan de inmediato. 50,000 puntos equivalen a $1 USD en nuestra tasa de cambio oficial.',
    sendCashoutHeader: '2. Retirar Saldo de Ganancias USD',
    sendCashoutDesc: 'Envíe sus fondos directamente a su servicio de billetera móvil o dirección blockchain preferida.',
    invalidAmountAlert: '⚠️ ¡Por favor ingrese una cantidad de retiro en dólares válida!',
    insuffUsdAlert: '⚠️ ¡Su balance USD (${current}) no cubre el retiro solicitado (${req})!',
    destRequiredAlert: '⚠️ ¡Se requiere el número de teléfono móvil o la dirección destino de la billetera!',
    invalidDestAlert: '⚠️ ¡Formato de datos de destino no válido para el cobro!',
    withdrawSuccessAlert: '💸 ¡Retiro de ${amount} USD enviado! En cola de pago del administrador.',
    requestedAmountLabel: 'Monto de Retiro en dólares ($):',
    maxAvailableLabel: 'Máximo: ${max}',
    fullUsdBalanceLabel: 'Sus dólares disponibles: ${max} (aproximadamente {egp} EGP)',
    mobileCashLabel: 'Monederos locales y Vodafone Cash:',
    cryptoLabel: 'Billeteras de Criptomonedas:',
    phoneTargetLabel: 'Número de cobro móvil de destino:',
    walletAddressLabel: 'Dirección de recepción {gateway}:',
    phonePlaceholder: 'Escriba su número Vodafone Cash o monedero local aquí',
    walletPlaceholder: 'Pegue la dirección para la red {gateway} detenidamente',
    submitWithdrawBtn: 'Solicitar Retiro de Fondos USD',
    ledgerHeader: 'Historial de Operaciones y Solicitudes de Cobro',
    noLedgerMessage: 'Aún no ha realizado cobros de saldo o intercambios en su cuenta.',
    thType: 'Tipo de Operación',
    thPoints: 'Puntos Gastados',
    thCash: 'Valor en USD',
    thInfo: 'Origen y Destino de Fondos',
    thTime: 'Fecha de Creación',
    thStatus: 'Estado de Aprobación',
    cashoutLabel: 'Retiro de Efectivo 💸',
    pointsExchgLabel: 'Canje de Puntos 🔄',
    pPointsExchg: 'Transacción de Puntos a Dólares',
    bronzeTier: 'Gama Bronce',
    silverTier: 'Gama Plata',
    goldTier: '🔥 Gama Oro (Bonus +$1)',
    championTier: '💎 Campeón del Portal (Bonus +$2)',
    btnRequestExchg: 'Canjear ahora ⚡',
    btnPointsInsuff: 'Puntos Insuficientes',
    valLabel: 'Tasa:',
    approvedStatus: 'Aprobado y Pagado ✅',
    rejectedStatus: 'Rechazado - Devuelto ❌',
    pendingStatus: 'Revisión en Curso 🕒',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  }
};

export default function ExchangePanel({ user, onExchangeDone, lang = 'en' }: ExchangePanelProps) {
  // 1. Point Conversion State
  const [conversionSuccessMsg, setConversionSuccessMsg] = useState<string | null>(null);
  const [conversionErrorMsg, setConversionErrorMsg] = useState<string | null>(null);

  // 2. USD Cash Out State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'BTC' | 'ETH' | 'DOGE' | 'TRX' | 'USDT' | 'VF_CASH' | 'ET_CASH' | 'OR_CASH' | 'WE_CASH' | 'INSTAPAY'>('VF_CASH');
  const [walletOrPhoneInput, setWalletOrPhoneInput] = useState('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = exchgTranslations[activeLang];

  const adminSettings = db.getAdminSettings();
  const rates = adminSettings.exchangeRates || [
    { points: 50000, dollars: 1, label: t.bronzeTier },
    { points: 100000, dollars: 2, label: t.silverTier },
    { points: 150000, dollars: 4, label: t.goldTier },
    { points: 200000, dollars: 6, label: t.championTier },
  ];

  // Load all user's transactions
  const allTransactions = db.getWithdrawals().filter(w => w.userId === user.uid);

  // Handle Exchange Points Click -> Converts to pending USD request
  const handlePointsToUSDExchange = (points: number, dollars: number) => {
    setConversionErrorMsg(null);
    setConversionSuccessMsg(null);

    if (user.points < points) {
      setConversionErrorMsg(
        t.insuffPointsAlert.replace('{count}', user.points.toLocaleString())
      );
      return;
    }

    // Submit points for conversion. Type is 'conversion' (or default / non-withdrawal)
    db.submitWithdrawal({
      userId: user.uid,
      userEmail: user.email,
      pointsExchanged: points,
      dollarsEarned: dollars,
      method: 'VF_CASH', // default placeholder
      walletOrPhone: t.directPointsExchg,
      type: 'conversion'
    });

    setConversionSuccessMsg(
      t.exchangeSentSuccess.replace('{points}', points.toLocaleString()).replace('{dollars}', dollars.toString())
    );
    onExchangeDone(); // notify main App component to sync balances

    setTimeout(() => {
      setConversionSuccessMsg(null);
    }, 6000);
  };

  // Handle USD Funds Cash Withdrawal Submit
  const handleUSDCashWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg(null);
    setWithdrawSuccessMsg(null);

    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawErrorMsg(t.invalidAmountAlert);
      return;
    }

    const currentUsdBalance = user.dollars || 0;
    if (amount > currentUsdBalance) {
      setWithdrawErrorMsg(
        t.insuffUsdAlert.replace('{current}', currentUsdBalance.toString()).replace('{req}', amount.toString())
      );
      return;
    }

    if (!walletOrPhoneInput.trim()) {
      setWithdrawErrorMsg(t.destRequiredAlert);
      return;
    }

    if (walletOrPhoneInput.trim().length < 6) {
      setWithdrawErrorMsg(t.invalidDestAlert);
      return;
    }

    // Submit USD withdrawal request
    db.submitWithdrawal({
      userId: user.uid,
      userEmail: user.email,
      pointsExchanged: 0,
      dollarsEarned: amount,
      method: selectedMethod,
      walletOrPhone: walletOrPhoneInput.trim(),
      type: 'withdrawal'
    });

    setWithdrawSuccessMsg(
      t.withdrawSuccessAlert.replace('{amount}', amount.toString())
    );
    setWithdrawAmount('');
    setWalletOrPhoneInput('');
    onExchangeDone(); // sync dollar balances

    setTimeout(() => {
      setWithdrawSuccessMsg(null);
    }, 6000);
  };

  const isLocalCash = (method: string) => {
    return ['VF_CASH', 'ET_CASH', 'OR_CASH', 'WE_CASH', 'INSTAPAY'].includes(method);
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

  const getStatusText = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return t.approvedStatus;
    if (status === 'rejected') return t.rejectedStatus;
    return t.pendingStatus;
  };

  const getStatusStyle = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'rejected') return 'text-red-400 bg-red-400/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className={`w-full font-sans max-w-6xl mx-auto space-y-8 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* HEADER BANNER - TOTAL BALANCE STATUS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex items-center gap-4 flex-row">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Coins className="w-8 h-8 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{t.mainTitle}</h2>
            <p className="text-xs text-slate-400 mt-1">{t.mainDesc}</p>
          </div>
        </div>

        {/* Current Balances Status Indicator */}
        <div className="flex items-center gap-4 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-850 w-full md:w-auto justify-around flex-row">
          <div className="text-center">
            <span className="block text-[10px] text-slate-500 font-extrabold uppercase mb-0.5">{t.availablePoints}</span>
            <span className="font-mono text-xl font-black text-amber-500">{user.points.toLocaleString()} pts</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-855"></div>
          <div className="text-center">
            <span className="block text-[10px] text-slate-500 font-extrabold uppercase mb-0.5">{t.availableDollars}</span>
            <span className="font-mono text-xl font-black text-emerald-400 block">${(user.dollars || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL 1: CONVERT POINTS TO USD DOLLARS */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-row">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-white">{t.pointsToUsdHeader}</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.pointsToUsdDesc}
            </p>

            {conversionSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 flex-row">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{conversionSuccessMsg}</span>
              </div>
            )}

            {conversionErrorMsg && (
              <div className="p-3 bg-red-400/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 flex-row">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{conversionErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {rates.map((rate) => {
                const canAfford = user.points >= rate.points;
                return (
                  <button
                    id={`exchg-rate-btn-${rate.points}`}
                    key={rate.points}
                    disabled={!canAfford}
                    onClick={() => handlePointsToUSDExchange(rate.points, rate.dollars)}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 relative text-right ${
                      canAfford
                        ? 'bg-slate-950/40 hover:bg-amber-500/05 hover:border-amber-500/40 border-slate-800 text-white cursor-pointer'
                        : 'bg-slate-950/70 border-slate-900 text-slate-550 cursor-not-allowed opacity-55'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full flex-row">
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 font-black block mb-0.5">{rate.label}</span>
                        <p className="text-sm font-black text-slate-200">{rate.points.toLocaleString()} pts</p>
                      </div>
                      <div className="text-left font-sans">
                        <p className="text-lg font-black text-amber-500">${rate.dollars}</p>
                        <span className="text-[8px] text-slate-500 block">≈ {rate.dollars * 50} EGP</span>
                      </div>
                    </div>
                    
                    <div className="w-full pt-2 border-t border-slate-850/60 flex justify-between items-center text-[9px] flex-row">
                      <span className={canAfford ? 'text-amber-500 font-bold' : 'text-slate-600'}>
                        {canAfford ? t.btnRequestExchg : t.btnPointsInsuff}
                      </span>
                      <span className="text-slate-500 font-mono">{t.valLabel} <strong className="text-white">${rate.dollars}</strong></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850/60 text-[10.5px] text-amber-500/90 leading-relaxed mt-4 flex items-start gap-2 flex-row">
            <HelpingHand className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{t.pointsInfoTip}</span>
          </div>
        </div>

        {/* PANEL 2: CASH OUT / USD CAPITAL WITHDRAWALS */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center gap-2 flex-row">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">{t.sendCashoutHeader}</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {t.sendCashoutDesc}
          </p>

          {withdrawSuccessMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 flex-row">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawSuccessMsg}</span>
            </div>
          )}

          {withdrawErrorMsg && (
            <div className="p-3 bg-red-400/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 flex-row">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{withdrawErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUSDCashWithdrawalSubmit} className="space-y-4">
            
            {/* Amount input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                {t.requestedAmountLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={t.maxAvailableLabel.replace('{max}', (user.dollars || 0).toString())}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-505 text-left font-mono font-bold"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-550 block">
                {t.fullUsdBalanceLabel.replace('{max}', (user.dollars || 0).toString()).replace('{egp}', ((user.dollars || 0) * 50).toLocaleString())}
              </span>
            </div>

            {/* Gateway Selection Buttons */}
            <div className="space-y-3 pt-1">
              <div>
                <span className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1.5">{t.mobileCashLabel}</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-row">
                  {[
                    { key: 'VF_CASH', label: t.mobileVodafone },
                    { key: 'ET_CASH', label: 'Etisalat' },
                    { key: 'OR_CASH', 'label': 'Orange' },
                    { key: 'WE_CASH', label: 'We Cash' },
                    { key: 'INSTAPAY', label: 'InstaPay' }
                  ].map((m) => (
                    <button
                      id={`payout-method-${m.key}`}
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedMethod(m.key as any)}
                      className={`py-2 px-1 rounded-lg border text-center text-[10px] transition font-bold cursor-pointer ${
                        selectedMethod === m.key
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-black'
                          : 'bg-slate-950 border-slate-855 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] text-slate-500 font-extrabold uppercase mb-1.5">{t.cryptoLabel}</span>
                <div className="grid grid-cols-1 gap-2 flex-row">
                  {[
                    { key: 'USDT', label: 'USDT (TRC20 / ERC20)' }
                  ].map((m) => (
                    <button
                      id={`payout-method-${m.key}`}
                      key={m.key}
                      type="button"
                      onClick={() => setSelectedMethod(m.key as any)}
                      className={`py-1.5 px-0.5 rounded-lg border text-center text-[9.5px] font-mono font-bold transition cursor-pointer ${
                        selectedMethod === m.key
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Address Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {isLocalCash(selectedMethod)
                  ? t.phoneTargetLabel
                  : t.walletAddressLabel.replace('{gateway}', selectedMethod)}
              </label>
              <div className="relative">
                <CreditCard className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={walletOrPhoneInput}
                  onChange={(e) => setWalletOrPhoneInput(e.target.value)}
                  placeholder={isLocalCash(selectedMethod) 
                    ? t.phonePlaceholder
                    : t.walletPlaceholder.replace('{gateway}', selectedMethod)}
                  className={`w-full pr-10 pl-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-emerald-500 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!(user.dollars && user.dollars > 0)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-550 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg shadow-emerald-600/10 mt-4"
            >
              🚀 {t.submitWithdrawBtn}
            </button>
          </form>
        </div>
      </div>

      {/* WITHDRAWAL & CONVERSION HISTORY LEDGER ARCHIVE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-base font-black text-white mb-5 flex items-center gap-2 justify-start flex-row">
          <History className="w-5 h-5 text-slate-400" />
          <span>{t.ledgerHeader}</span>
        </h3>

        {allTransactions.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-850/65 text-slate-500 text-xs font-medium">
            {t.noLedgerMessage}
          </div>
        ) : (
          <div className="overflow-x-auto select-text">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 uppercase font-bold text-[10px]/[1.5]">
                  <th className={`py-2 px-3 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thType}</th>
                  <th className={`py-2 px-3 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thPoints}</th>
                  <th className={`py-2 px-3 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thCash}</th>
                  <th className={`py-2 px-3 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thInfo}</th>
                  <th className={`py-2 px-3 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thTime}</th>
                  <th className="py-2 px-3 text-center">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {allTransactions.map((item) => {
                  const isWith = item.type === 'withdrawal';
                  return (
                    <tr key={item.id} className="text-slate-350 hover:bg-slate-850/30 transition">
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWith ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'
                        }`}>
                          {isWith ? t.cashoutLabel : t.pointsExchgLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-300">
                        {isWith ? '-' : `${item.pointsExchanged.toLocaleString()} pts`}
                      </td>
                      <td className={`py-3.5 px-3 font-black ${isWith ? 'text-red-405 text-red-400' : 'text-emerald-400'}`}>
                        {isWith ? `-$${item.dollarsEarned}` : `+$${item.dollarsEarned}`}
                        {isLocalCash(item.method) && isWith && ` (${(item.dollarsEarned * 50).toLocaleString()} EGP)`}
                      </td>
                      <td className="py-3.5 px-3 text-[11px] font-medium max-w-[220px] truncate" title={item.walletOrPhone}>
                        {isWith ? (
                          <span>
                            <strong className="text-white text-xs">{getMethodLabel(item.method)}</strong> • {item.walletOrPhone}
                          </span>
                        ) : (
                          <span className="text-slate-500">{t.pPointsExchg}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[10px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString(activeLang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
