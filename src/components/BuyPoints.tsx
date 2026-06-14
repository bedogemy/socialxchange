import React, { useState } from 'react';
import { db } from '../lib/db';
import { User, CryptoPayment } from '../types';
import { Coins, Copy, Check, ShieldCheck, ArrowUpRight, History, CreditCard, ExternalLink, QrCode, PhoneCall, Upload, Image, Trash2 } from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface BuyPointsProps {
  user: User;
  onPaymentSubmitted: () => void;
  lang?: string;
}

const buyTrans: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    badgeGates: 'بوابات الشحن الفورية',
    mainTitle: 'شراء حزم النقاط السريعة',
    step1Title: '1. اختر حزمة النقاط المناسبة لك',
    step2Title: '2. حدد بوابة الدفع المحلية (كاش / انستا باي)',
    orCryptoTitle: 'أو الدفع عبر العملات الرقمية والشبكات',
    recipientLabel: 'رقم استقبال الأموال لـ ({gateway})',
    recipientWalletAddress: 'عنوان محفظة الاستقبال الخاص بنا ({gateway})',
    secureGate: 'بوابة مأمنة',
    egyCashNote: '⚠️ ملحوظة للتحويل المحلي: القيمة المحتسبة يتم تحويلها بالجنيه المصري بمعدل تحويل ثابت وقدره 50 ج.م لكل 1 دولار أمريكي. أي أن المبلغ الإجمالي المطلوب إرساله هو: {amount} جنيه مصري.',
    calcCryptoNote: 'يرجى تحويل مبلغ الاستحقاق الكلي للطلب بدقة تفادياً لإلغاء المراجعة.',
    step3Title: '3. تقديم إثبات ومراجعة التحويل',
    successSubmitMsg: 'تم إرسال إيصال التحويل للإدارة بنجاح! سيتم فحص المعاملة وشحن محفظتك تلقائياً.',
    invalidTxMsg: 'يرجى إدخال رقم الهاتف المحول منه أو رقم العملية لتأكيد التحويل',
    invalidHashMsg: 'يرجى إدخال هاش المعاملة أو رقم التعريف لعملية التحويل البرهاني',
    invalidShortMsg: 'الرجاء إدخال تفاصيل تحويل كافية أو رقم هاتف صحيح للتأكيد.',
    invoicePack: 'سداد حزمة:',
    invoicePoints: '{count} نقطة',
    invoiceCost: 'القيمة المطلوبة:',
    invoiceCostVal: '${usd} USD / {egp} جنيه',
    invoiceCostUsd: '${usd} USD',
    invoiceBy: 'الدفع بواسطة:',
    payoutPhoneLabel: 'رقم الهاتف المحول منه أو كود العملية الفوري',
    payoutTxLabel: 'هاش المعاملة / رقم تعريف التحويل (TxID)',
    payoutPhonePlaceholder: 'اكتب رقم المحمول الذي قمت بالتحويل منه أو رقم العملية هنا',
    payoutTxPlaceholder: 'ألصق الـ Transaction Hash (TxID) هنا',
    submitReceiptBtn: 'أرسل إيصال الإيداع للمراجعين',
    adminReviewHeader: 'مراجعة تحويلات يدوية فائقة الأمان',
    adminReviewDesc: 'يقوم فريق الإدارة بمطابقة المعاملات فورياً بالتحقق من الحسابات البنكية ومحافظ الكاش واعتماد النقاط خلال 10 إلى 30 دقيقة كحد أقصى.',
    historyHeader: 'سجل طلبات شحن المحفظة',
    noHistoryMessage: 'لا توجد عمليات شراء معلّقة أو سابقة في حسابك حالياً.',
    thSize: 'حجم الباقة',
    thCost: 'القيمة التقديرية',
    thCurrency: 'بواسطة عملة',
    thTxId: 'إيصال التحويل / الرقم',
    thDate: 'تاريخ الطلب',
    thStatus: 'حالة الطلب',
    statusApproved: 'مقبول - تم شحن حسابك ✅',
    statusRejected: 'مرفوض - تفاصيل خاطئة ❌',
    statusPending: 'قيد الانتظار - المراجعة جارية 🕒',
    activeNow: 'نشط حالياً',
    packDesc1: 'حزمة المبتدئين - انطلاقة سريعة',
    packDesc2: 'الحزمة الفضية - الأكثر شعبية',
    packDesc3: 'الحزمة الذهبية - توفير متميز',
    packDesc4: 'حزمة السوبر - قيمة إضافية رائعة',
    packDesc5: 'حزمة الهامور - خيار ممتاز للتوفير',
    packDesc6: '🔥 العرض الخارق الاستثنائي - أكبر وأقوى خصم بالمنصة (توفير 65%)',
    mobileVodafone: 'فودافون كاش',
    mobileEtisalat: 'اتصالات كاش',
    mobileOrange: 'أورنج كاش',
    mobileWe: 'وي كاش',
    mobileInstapay: 'إنستا باي InstaPay'
  },
  en: {
    badgeGates: 'Instant Cargo Portals',
    mainTitle: 'Purchase Quick Points packages',
    step1Title: '1. Select the points package right for you',
    step2Title: '2. Select target local carrier/gateway (Cash / InstaPay)',
    orCryptoTitle: 'Or send via cryptocurrency networks',
    recipientLabel: 'Recipient Mobile Cash details for ({gateway})',
    recipientWalletAddress: 'Our recipient wallet address for ({gateway})',
    secureGate: 'Secured Gate',
    egyCashNote: '⚠️ Local transfer note: Values are handled in Egyptian Pounds with a fixed rate of 50 EGP per 1 USD. The total target sending amount is: {amount} EGP.',
    calcCryptoNote: 'Please transfer the exact invoice value requested above to secure quick approval.',
    step3Title: '3. Submit and Verify Payment Proof',
    successSubmitMsg: 'Your payment invoice proof has been sent successfully! Our administration will check deposit coordinates and credit your wallet.',
    invalidTxMsg: 'Please enter target phone number or reference code to log payment.',
    invalidHashMsg: 'Please enter transaction txHash or transaction identifier.',
    invalidShortMsg: 'Please write sufficient transfer confirmation notes or correct sender ID.',
    invoicePack: 'Invoice package:',
    invoicePoints: '{count} Points',
    invoiceCost: 'Required Cost:',
    invoiceCostVal: '${usd} USD / {egp} EGP',
    invoiceCostUsd: '${usd} USD',
    invoiceBy: 'Pay via:',
    payoutPhoneLabel: 'Sender Mobile phone number or immediate process code',
    payoutTxLabel: 'Transaction hash ID / Reference token (TxID)',
    payoutPhonePlaceholder: 'Payer mobile number or operation reference number',
    payoutTxPlaceholder: 'Paste the transaction hash / transaction identifier here',
    submitReceiptBtn: 'Send Payer Receipt to Review team',
    adminReviewHeader: 'Highly Secure Manual Audit Verification',
    adminReviewDesc: 'Our administrative audit team cross-checks bank records and cash pools, authenticating packages within 10 to 30 minutes max.',
    historyHeader: 'Wallet top up history Ledger',
    noHistoryMessage: 'No pending or previous points purchases recorded for your account.',
    thSize: 'Package Size',
    thCost: 'Total Pricing',
    thCurrency: 'Currency gateway',
    thTxId: 'Invoice TxID ID',
    thDate: 'Log Date',
    thStatus: 'Deposit Status',
    statusApproved: 'Funded & Credited ✅',
    statusRejected: 'Rejected due to mismatch ❌',
    statusPending: 'Under verification audit 🕒',
    activeNow: 'Selected Tier',
    packDesc1: 'Starter Tier - Quick Boost',
    packDesc2: 'Silver Tier - Popular Demand',
    packDesc3: 'Gold Tier - Saving options',
    packDesc4: 'Super Tier - Ultimate boost',
    packDesc5: 'VIP Pack - High volume',
    packDesc6: '🔥 Super Extra Promotion - Save up to 65% with our biggest offer!',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  },
  fr: {
    badgeGates: 'Recharges de Solde Instantanées',
    mainTitle: 'Acheter des Packages de Points Rapides',
    step1Title: '1. Choisissez une formule de points',
    step2Title: '2. Indiquez la passerelle locale (Portefeuille Mobile / InstaPay)',
    orCryptoTitle: 'Ou payer via cryptomonnaies décentralisées',
    recipientLabel: 'Coordonnées de réception de fonds pour ({gateway})',
    recipientWalletAddress: 'Notre adresse de portefeuille de réception ({gateway})',
    secureGate: 'Flux Chiffré',
    egyCashNote: '⚠️ Note transfert égyptien: La conversion se fait au taux fixe de 50 EGP par 1 USD. Le montant exact à expédier est: {amount} EGP.',
    calcCryptoNote: 'Veuillez effectuer le transfert correspondant au montant précis prescrit ci-dessus.',
    step3Title: '3. Transmettre le justificatif et valider',
    successSubmitMsg: 'Reçu de paiement transmis à l\'administration avec succès! Les vérifications sont automatisées.',
    invalidTxMsg: 'Veuillez inscrire le numéro d\'origine du virement ou son ID de pièce.',
    invalidHashMsg: 'Veuillez introduire l\'identifiant de transaction (TxID).',
    invalidShortMsg: 'Détails insuffisants. Indiquez un numéro d\expédition valable.',
    invoicePack: 'Plan facturation:',
    invoicePoints: '{count} Points',
    invoiceCost: 'Coût demandé:',
    invoiceCostVal: '${usd} USD / {egp} EGP',
    invoiceCostUsd: '${usd} USD',
    invoiceBy: 'Payé par:',
    payoutPhoneLabel: 'Numéro expéditeur ou code de transaction instantané',
    payoutTxLabel: 'ID / Hachage de transaction blockchain (TxID)',
    payoutPhonePlaceholder: 'Saisissez le numéro expéditeur ou la référence ici',
    payoutTxPlaceholder: 'Collez le hash de transaction blockchain (TxID)',
    submitReceiptBtn: 'Déposer le reçu de paiement',
    adminReviewHeader: 'Audit manuel hautement sécurisé',
    adminReviewDesc: 'Nos conseillers d\'administration calibrent les validations en croisant les répertoires financiers sous 10 à 30 minutes maximalement.',
    historyHeader: 'Relevé de facturation et recharges de points',
    noHistoryMessage: 'Aucune transaction d\'achat de points répertoriée dans votre historique.',
    thSize: 'Plan Consenti',
    thCost: 'Coût Intégral',
    thCurrency: 'Moyen paiement',
    thTxId: 'ID Code Paiement',
    thDate: 'Validité',
    thStatus: 'Examen de conformité',
    statusApproved: 'Payé & Activé ✅',
    statusRejected: 'Rejeté pour non-conformité ❌',
    statusPending: 'Examen en cours 🕒',
    activeNow: 'Sélectionné',
    packDesc1: 'Offre Débutant - Pas de géant',
    packDesc2: 'Niveau Silver - Le plus réclamé',
    packDesc3: 'Niveau Gold - Épargne renforcée',
    packDesc4: 'Niveau Super - Giga visibilité',
    packDesc5: 'Niveau VIP - Destiné aux Pros',
    packDesc6: '🔥 Super Promotion Extraordinaire - Économisez 65% sur l\'achat de masse !',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  },
  es: {
    badgeGates: 'Pasarelas de Compra Express',
    mainTitle: 'Adquirir Paquetes de Puntos',
    step1Title: '1. Seleccione la gama de puntos ideal',
    step2Title: '2. Determine la vía de pago local (Vodafone / InstaPay)',
    orCryptoTitle: 'O deposite mediante activos criptográficos',
    recipientLabel: 'Detalles de depósito móvil de Vodafone para ({gateway})',
    recipientWalletAddress: 'Nuestra clave pública de billetera para ({gateway})',
    secureGate: 'Operación Segura',
    egyCashNote: '⚠️ Nota de transferencia local: Los montos locales operan en libras egipcias con tasa fija de 50 EGP por 1 USD. El valor a enviar es de: {amount} EGP.',
    calcCryptoNote: 'Asegúrese de enviar exactamente el monto correspondiente para evitar rechazos.',
    step3Title: '3. Cargar Justificante de Transferencia',
    successSubmitMsg: '¡Su documento de pago ha sido transferido al panel administrativo! Los fondos se acreditarán a su balance.',
    invalidTxMsg: 'Escriba el origen móvil o código identificador del abono rápido.',
    invalidHashMsg: 'Ingrese el Hash o número de confirmación (TxID) del abono.',
    invalidShortMsg: 'La información del depósito provista es insuficiente para auditar con éxito.',
    invoicePack: 'Plan de saldo:',
    invoicePoints: '{count} Puntos',
    invoiceCost: 'Monto correspondiente:',
    invoiceCostVal: '${usd} USD / {egp} EGP',
    invoiceCostUsd: '${usd} USD',
    invoiceBy: 'Método de abono:',
    payoutPhoneLabel: 'Número móvil emisor o referencia del abono',
    payoutTxLabel: 'Hash público o referencia de transacción (TxID)',
    payoutPhonePlaceholder: 'Escriba la billetera origen o identificador de proceso aquí',
    payoutTxPlaceholder: 'Pegue la clave hash del bloque (TxID) del envío',
    submitReceiptBtn: 'Enviar Justificante de Pago',
    adminReviewHeader: 'Auditoría manual de seguridad reforzada',
    adminReviewDesc: 'El grupo de administración coteja los flujos de capital bancario acreditando las transacciones de 10 a 30 minutos máximo.',
    historyHeader: 'Control de Cargas de Fondos Realizadas',
    noHistoryMessage: 'No hay operaciones de carga o pedidos pendientes en su historial comercial.',
    thSize: 'Plan Consumido',
    thCost: 'Costo Total',
    thCurrency: 'Abonado vía',
    thTxId: 'Identificador TxID',
    thDate: 'Registro',
    thStatus: 'Auditoría',
    statusApproved: 'Aprobado y Cargado ✅',
    statusRejected: 'Rechazado - Datos incorrectos ❌',
    statusPending: 'Validación en Progreso 🕒',
    activeNow: 'Seleccionado',
    packDesc1: 'Fórmula Inicial - Despegue rápido',
    packDesc2: 'Fórmula Plata - Preferencia comunitaria',
    packDesc3: 'Fórmula Oro - Ahorro del inversor',
    packDesc4: 'Fórmula Super - Tráfico de alta gama',
    packDesc5: 'Fórmula Gigante - Preferente e ilimitado',
    packDesc6: '🔥 Megaconexión de Ofertas - ¡Ahorro extremo del 65% de descuento!',
    mobileVodafone: 'Vodafone Cash',
    mobileEtisalat: 'Etisalat Cash',
    mobileOrange: 'Orange Cash',
    mobileWe: 'We Cash',
    mobileInstapay: 'InstaPay'
  }
};

export default function BuyPoints({ user, onPaymentSubmitted, lang = 'en' }: BuyPointsProps) {
  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = buyTrans[activeLang];

  const adminSettings = db.getAdminSettings();
  const allPayments = db.getPayments().filter(p => p.userId === user.uid);

  const packages = adminSettings.purchasePackages && adminSettings.purchasePackages.length > 0
    ? adminSettings.purchasePackages
    : [
        { id: 'pack1', name: 'الباقة الفضية', points: 30000, price: 5, desc: t.packDesc2 },
        { id: 'pack2', name: 'الباقة الذهبية', points: 100005, price: 10, desc: t.packDesc3 },
        { id: 'pack3', name: 'الباقة العملاقة', points: 200000, price: 18, desc: t.packDesc5 },
        { id: 'pack4', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: t.packDesc6 }


      ];

  const [selectedPack, setSelectedPack] = useState<{ points: number; price: number }>(() => {
    return packages[0] || { points: 30000, price: 5 };
  });
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'DOGE' | 'TRX' | 'USDT' | 'VF_CASH' | 'ET_CASH' | 'OR_CASH' | 'WE_CASH' | 'INSTAPAY'>('USDT');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Transfer Proof screenshot upload states
  const [screenshotFile, setScreenshotFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Export as JPEG with 70% quality (0.7) for optimal compression < 300KB
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const processAndCompressFile = (file: File) => {
    setIsCompressing(true);
    setFormError(null);
    compressImage(file)
      .then((compressedBase64) => {
        setScreenshotFile(compressedBase64);
        setIsCompressing(false);
      })
      .catch((err) => {
        console.error('Compression error:', err);
        setFormError(activeLang === 'ar' ? 'فشل ضغط الصورة، يرجى المحاولة مرة أخرى.' : 'Image compression failed, please try again.');
        setIsCompressing(false);
      });
  };

  // Read uploaded receipt picture as DataUrl and initiate client-side compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompressFile(file);
    }
  };

  const clearScreenshot = () => {
    setScreenshotFile(null);
  };

  const getCryptoAddress = () => {
    switch (selectedCrypto) {
      case 'BTC': return adminSettings.btcAddress;
      case 'ETH': return adminSettings.ethAddress;
      case 'DOGE': return adminSettings.dogeAddress;
      case 'TRX': return adminSettings.trxAddress;
      case 'USDT': return adminSettings.usdtAddress;
      case 'VF_CASH': return adminSettings.vodafoneCash || '01012345678';
      case 'ET_CASH': return adminSettings.etisalatCash || '01112345678';
      case 'OR_CASH': return adminSettings.orangeCash || '01212345678';
      case 'WE_CASH': return adminSettings.weCash || '01512345678';
      case 'INSTAPAY': return adminSettings.instapay || 'username@instapay';
      default: return adminSettings.usdtAddress;
    }
  };

  const currentAddress = getCryptoAddress();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFriendlyName = (currency: typeof selectedCrypto) => {
    switch (currency) {
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
      default: return currency;
    }
  };

  const isLocalCashOption = (currency: typeof selectedCrypto) => {
    return ['VF_CASH', 'ET_CASH', 'OR_CASH', 'WE_CASH', 'INSTAPAY'].includes(currency);
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitted(false);

    const isCash = isLocalCashOption(selectedCrypto);

    if (!screenshotFile) {
      setFormError(
        activeLang === 'ar'
          ? 'عذراً! يجب عليك رفع ملف صورة التحويل (الإيصال) أولاً لتفعيل شحن الرصيد.'
          : 'Please select and upload your transfer receipt screenshot first.'
      );
      return;
    }

    if (!txHash.trim()) {
      setFormError(
        isCash 
          ? t.invalidTxMsg
          : t.invalidHashMsg
      );
      return;
    }

    if (txHash.trim().length < 4) {
      setFormError(t.invalidShortMsg);
      return;
    }

    // Call server endpoint
    fetch('/api/submit-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.uid,
        userEmail: user.email,
        packagePoints: selectedPack.points,
        packagePrice: selectedPack.price,
        packageName: selectedPack.points === 30000 ? 'الباقة الفضية' : selectedPack.points === 100005 ? 'الباقة الذهبية' : selectedPack.points === 200000 ? 'الباقة العملاقة' : 'الباقة الاحترافية',
        cryptoCurrency: selectedCrypto,
        senderWallet: txHash.trim(),
        transferImage: screenshotFile
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Network error');
      }
      return res.json();
    })
    .then((data) => {
      // Sync locally
      if (data && data.payment) {
        const localPayments = db.getPayments();
        if (!localPayments.some(p => p.id === data.payment.id)) {
          localPayments.push(data.payment);
          localStorage.setItem('ytsocial_payments', JSON.stringify(localPayments));
        }
      }
      setSubmitted(true);
      setTxHash('');
      clearScreenshot();
      onPaymentSubmitted();
      setTimeout(() => setSubmitted(false), 4000);
    })
    .catch((err) => {
      console.warn('API route call error, falling back to direct Firestore sync:', err);
      try {
        const fallbackPayment = db.submitPayment({
          userId: user.uid,
          userEmail: user.email,
          packagePoints: selectedPack.points,
          packagePrice: selectedPack.price,
          cryptoCurrency: selectedCrypto,
          transactionHash: txHash.trim(),
          screenshotUrl: screenshotFile
        });
        
        setSubmitted(true);
        setTxHash('');
        clearScreenshot();
        onPaymentSubmitted();
        setTimeout(() => setSubmitted(false), 4000);
      } catch (fallbackErr: any) {
        setFormError(activeLang === 'ar' ? 'فشل حفظ الطلب: ' + (fallbackErr.message || 'حدث خطأ غير معروف') : 'Failed to save request: ' + (fallbackErr.message || 'Unknown error'));
      }
    });
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (status === 'rejected') return 'text-red-400 bg-red-400/10 border-red-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  const getStatusLabel = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'approved') return t.statusApproved;
    if (status === 'rejected') return t.statusRejected;
    return t.statusPending;
  };

  return (
    <div className={`w-full font-sans max-w-5xl mx-auto ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8 flex-row">
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-full border border-amber-500/20">
          {t.badgeGates}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-row">
          {t.mainTitle}
          <Coins className="w-6 h-6 text-amber-500" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Package & Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select Package */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 justify-start flex-row">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <span>{t.step1Title}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pack) => (
                <button
                  id={`pkg-btn-${pack.points}`}
                  key={pack.points}
                  onClick={() => setSelectedPack({ points: pack.points, price: pack.price })}
                  className={`p-5 rounded-2xl border transition flex flex-col justify-between gap-3 cursor-pointer relative ${
                    selectedPack.points === pack.points
                      ? 'bg-red-555 bg-red-500/5 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center w-full flex-row">
                    <div className="text-left font-sans">
                      <div className="text-2xl font-black text-amber-500">${pack.price}</div>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        ≈ {Math.round(pack.price * 50)} EGP
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black">{pack.points.toLocaleString()} pts</p>
                      <p className="text-xs opacity-75">{pack.desc}</p>
                    </div>
                  </div>
                  {selectedPack.points === pack.points && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-lg font-bold">
                      {t.activeNow}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Currency */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
            {/* Local E-Wallets Cash */}
            <div>
              <h3 className="text-sm font-black text-slate-200 mb-3 flex items-center justify-start gap-1.5 flex-row">
                <PhoneCall className="w-4 h-4 text-amber-500" />
                <span>{t.step2Title}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-row">
                {[
                  { key: 'VF_CASH', label: t.mobileVodafone },
                  { key: 'ET_CASH', label: 'Etisalat' },
                  { key: 'OR_CASH', 'label': 'Orange' },
                  { key: 'WE_CASH', label: 'We Cash' },
                  { key: 'INSTAPAY', label: 'InstaPay' }
                ].map((item) => (
                  <button
                    id={`coin-${item.key}`}
                    key={item.key}
                    onClick={() => setSelectedCrypto(item.key as any)}
                    className={`py-3 px-1 rounded-xl border text-center transition font-bold text-xs cursor-pointer ${
                      selectedCrypto === item.key
                        ? 'bg-red-500/10 border-red-500 text-red-500 font-extrabold'
                        : 'bg-slate-950 border-slate-855 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Crypto Currency Selection */}
            <div>
              <h3 className="text-sm font-black text-slate-200 mb-3 flex items-center justify-start gap-1.5 flex-row">
                <QrCode className="w-4 h-4 text-emerald-500" />
                <span>{t.orCryptoTitle}</span>
              </h3>
              <div className="grid grid-cols-5 gap-2 flex-row">
                {(['USDT', 'BTC', 'ETH', 'TRX', 'DOGE'] as const).map((coin) => (
                  <button
                    id={`coin-${coin}`}
                    key={coin}
                    onClick={() => setSelectedCrypto(coin)}
                    className={`py-3 px-1 rounded-xl border text-center transition font-bold font-mono text-sm cursor-pointer ${
                      selectedCrypto === coin
                        ? 'bg-amber-500/10 border-amber-505 text-amber-500 font-extrabold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {coin}
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address / Number copier card */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl mt-5">
              <div className="flex items-center justify-between flex-row">
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/10 px-2 py-0.5 rounded-full font-bold">{t.secureGate}</span>
                <span className="text-xs text-slate-300">
                  {isLocalCashOption(selectedCrypto)
                    ? t.recipientLabel.replace('{gateway}', getFriendlyName(selectedCrypto))
                    : t.recipientWalletAddress.replace('{gateway}', selectedCrypto)
                  }:
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 flex-row">
                <div className="text-xs font-mono select-all break-all overflow-x-auto text-left w-full text-slate-300 px-2 py-1 bg-slate-950/50 rounded">
                  {currentAddress}
                </div>
                <button
                  id="copy-address-btn"
                  onClick={handleCopy}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-850 text-slate-400 hover:text-white transition cursor-pointer flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {isLocalCashOption(selectedCrypto) ? (
                <div className="mt-3 bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-right">
                  <p className="text-[11px] text-red-400 leading-normal font-sans font-bold">
                    {t.egyCashNote.replace('{amount}', (selectedPack.price * 50).toLocaleString())}
                  </p>
                </div>
              ) : (
                <p className={`text-[10px] text-slate-500 mt-2 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.calcCryptoNote}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Form Submission Invoice */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-bold text-white mb-4">{t.step3Title}</h3>
            
            {submitted && (
              <div className="p-4 mb-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-2xl text-xs text-center flex items-center justify-center gap-2 flex-row">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>{t.successSubmitMsg}</span>
              </div>
            )}

            {formError && (
              <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs text-center">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitTx} className="space-y-4">
              <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs text-slate-400 flex-row">
                  <span className="font-bold text-white">{t.invoicePoints.replace('{count}', selectedPack.points.toLocaleString())}</span>
                  <span>{t.invoicePack}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 flex-row">
                  <span className="font-extrabold text-amber-555 text-amber-550 text-amber-500">
                    {isLocalCashOption(selectedCrypto) 
                      ? t.invoiceCostVal.replace('{usd}', selectedPack.price.toString()).replace('{egp}', (selectedPack.price * 50).toLocaleString())
                      : t.invoiceCostUsd.replace('{usd}', selectedPack.price.toString())}
                  </span>
                  <span>{t.invoiceCost}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-900 pt-2 flex-row">
                  <span className="font-bold text-slate-200">{getFriendlyName(selectedCrypto)}</span>
                  <span>{t.invoiceBy}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-sans font-bold">
                  {isLocalCashOption(selectedCrypto)
                    ? t.payoutPhoneLabel
                    : t.payoutTxLabel}
                </label>
                <input
                  id="tx-hash-input"
                  type="text"
                  disabled={!screenshotFile || isCompressing}
                  placeholder={
                    isCompressing
                      ? (activeLang === 'ar' ? '⏳ جاري ضغط ومعالجة الصورة بمحرك المتصفح...' : '⏳ Compressing and optimizing receipt receipt...')
                      : !screenshotFile
                        ? (activeLang === 'ar' ? '⚠️ يرجى رفع ملف صورة التحويل أولاً لتفعيل الإدخال' : '⚠️ Please upload the transfer screenshot first')
                        : (isLocalCashOption(selectedCrypto) ? t.payoutPhonePlaceholder : t.payoutTxPlaceholder)
                  }
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs outline-none placeholder-slate-600 text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-950/50 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>

              {/* Graphical Transfer/Screenshot Upload Component */}
              <div className="space-y-1.5 flex flex-col items-stretch">
                <label className="block text-xs text-slate-400 font-sans font-bold">
                  {activeLang === 'ar' ? 'إثبات ومستند التحويل / لقطة الشاشة (مطلوب)' : 'Upload Transfer Receipt / Screenshot (Required)'}
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-5 transition-all duration-200 text-center relative ${
                    isDragOver 
                      ? 'border-amber-500 bg-amber-500/5' 
                      : screenshotFile 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      processAndCompressFile(file);
                    }
                  }}
                >
                  <label className="cursor-pointer block space-y-2 py-3">
                    <div className="flex justify-center text-slate-500">
                      <Upload className="w-8 h-8 stroke-2 mb-1 text-slate-400 animate-pulse" />
                    </div>
                    {isCompressing ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-amber-400 font-bold">
                          {activeLang === 'ar' ? 'جاري ضغط وتقليص حجم الصورة...' : 'Compressing and resizing image...'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-200 font-semibold font-sans">
                          {activeLang === 'ar' ? 'اضغط هنا لرفع صورة الحوالة أو اسحب المستند هنا' : 'Click to select or drag receipt image here'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          PNG, JPG, JPEG (Max 8MB)
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isCompressing}
                    />
                  </label>
                </div>

                {/* Secure design preview - Thumbnail displayed directly below the drag box */}
                {screenshotFile && !isCompressing && (
                  <div className="mt-3 p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl border border-slate-800 overflow-hidden bg-slate-900 flex-shrink-0">
                        <img src={screenshotFile} alt="Receipt proof preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">
                          {activeLang === 'ar' ? 'تم الضغط بنجاح مع تأمين الوضوح' : 'Compressed successfully & details secured'}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-medium font-sans">
                          {activeLang === 'ar' ? 'الحجم الآن أقل من 300KB ومحقنة Base64 جاهزة ✅' : 'Size is now optimized & Base64 is ready ✅'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearScreenshot}
                      className="p-2 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition cursor-pointer border border-slate-800 hover:border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                id="submit-tx-btn"
                type="submit"
                disabled={!screenshotFile || isCompressing}
                className={`w-full py-3 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1.5 text-sm shadow-md flex-row ${
                  !screenshotFile || isCompressing
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
                    : 'bg-amber-500 hover:bg-amber-400 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-slate-950" />
                <span>{t.submitReceiptBtn}</span>
              </button>
            </form>
          </div>

          {/* Secure Assurance Card */}
          <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-start gap-3 flex-row text-right">
            <ShieldCheck className="w-10 h-10 text-emerald-500 flex-shrink-0 animate-pulse" />
            <div>
              <h4 className="text-xs font-bold text-white mb-1">{t.adminReviewHeader}</h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                {t.adminReviewDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buying History List Section */}
      <div className="mt-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2 justify-start flex-row">
          <History className="w-5 h-5 text-slate-400" />
          <span>{t.historyHeader}</span>
        </h3>

        {allPayments.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-900">
            <CreditCard className="w-8 h-8 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{t.noHistoryMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs">
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thSize}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thCost}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thCurrency}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thTxId}</th>
                  <th className={`py-3 px-4 font-semibold ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}>{t.thDate}</th>
                  <th className="py-3 px-4 font-semibold text-center">{t.thStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {allPayments.map((pay) => (
                  <tr key={pay.id} className="text-slate-300">
                    <td className="py-3.5 px-4 font-bold text-white text-right">{pay.packagePoints.toLocaleString()} pts</td>
                    <td className="py-3.5 px-4 font-bold text-amber-500 text-right">
                      ${pay.packagePrice}
                      {isLocalCashOption(pay.cryptoCurrency) && (
                        <span className="text-[10px] text-slate-405 font-medium ml-1">
                          ( {(pay.packagePrice * 50).toLocaleString()} EGP )
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-xs text-right text-slate-200">
                      {getFriendlyName(pay.cryptoCurrency)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center gap-1.5 font-mono text-xs max-w-[150px] truncate text-slate-440 hover:text-white transition">
                        <span>{pay.transactionHash}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 text-right">
                      {new Date(pay.createdAt).toLocaleDateString(activeLang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`px-2.5 py-1 text-center rounded-lg border text-xs font-bold ${getStatusColor(pay.status)}`}>
                        {getStatusLabel(pay.status)}
                      </div>
                      {pay.status === 'rejected' && pay.rejectReason && (
                        <p className="text-[10px] text-red-400 mt-1.5 text-center font-bold">
                          {activeLang === 'ar' ? 'السبب:' : 'Reason:'} {pay.rejectReason}
                        </p>
                      )}
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
