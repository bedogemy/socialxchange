export interface PricingPackage {
  id: string;
  name: {
    ar: string;
    en: string;
    fr: string;
    es: string;
  };
  points: number;
  price: number;
  isBestValue?: boolean;
  features: {
    ar: string[];
    en: string[];
    fr: string[];
    es: string[];
  };
  badgeColor: string;
  glowColor: string;
  btnColorBg: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: "silver",
    name: {
      ar: "الباقة الفضية",
      en: "Silver Package",
      fr: "Pack Argent",
      es: "Paquete Plata"
    },
    points: 30000,
    price: 5.00,
    features: {
      ar: [
        "دعم فني عالي الأولوية",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "أولوية ظهور التفاعل +10%"
      ],
      en: [
        "Priority customer support",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Priority network exposure +10%"
      ],
      fr: [
        "Support client prioritaire",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Exposition prioritaire +10%"
      ],
      es: [
        "Soporte al cliente prioritario",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Exposición preferencial +10%"
      ]
    },
    badgeColor: "bg-slate-400/10 text-slate-300 border-slate-400/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.15)] hover:border-slate-400/40",
    btnColorBg: "bg-slate-600 hover:bg-slate-500 shadow-slate-500/20"
  },
  {
    id: "gold",
    name: {
      ar: "الباقة الذهبية",
      en: "Gold Package",
      fr: "Pack Or",
      es: "Paquete Oro"
    },
    points: 100005,
    price: 10.00,
    isBestValue: true,
    features: {
      ar: [
        "دعم فني فوري ذو أولوية فائقة VIP",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "أولوية ظهور التفاعل +25%",
        "ميزة الترويج الفوري السريع للحملات"
      ],
      en: [
        "VIP Instant customer support",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Priority network exposure +25%",
        "Express campaign booster badge"
      ],
      fr: [
        "Support technique instantané VIP",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Exposition prioritaire +25%",
        "Badge amplificateur express"
      ],
      es: [
        "Soporte técnico inmediato VIP",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Exposición preferencial +25%",
        "Acelerador de campañas express"
      ]
    },
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/50 hover:border-amber-400/70",
    btnColorBg: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-amber-500/30"
  },
  {
    id: "giant",
    name: {
      ar: "الباقة العملاقة",
      en: "Giant Package",
      fr: "Pack Géant",
      es: "Paquete Gigante"
    },
    points: 200000,
    price: 18.00,
    features: {
      ar: [
        "دعم فني بأولوية فائقة مع رعاية خاصة",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "أولوية ظهور التفاعل +40%",
        "الترويج التلقائي للحملات المضافة"
      ],
      en: [
        "High-priority custom support tier",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Priority network exposure +40%",
        "Auto campaign propagation booster"
      ],
      fr: [
        "Support prioritaire haute voltige",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Exposition prioritaire +40%",
        "Auto-amplificateur de campagnes"
      ],
      es: [
        "Soporte de alta prioridad exclusivo",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Exposición preferencial +40%",
        "Autoaceleración de campañas"
      ]
    },
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/40",
    btnColorBg: "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
  },
  {
    id: "pro",
    name: {
      ar: "الباقة الاحترافية",
      en: "Professional Package",
      fr: "Pack Professionnel",
      es: "Paquete Profesional"
    },
    points: 1000000,
    price: 60.00,
    features: {
      ar: [
        "مدير حساب شخصي متكامل متاح 24/7",
        "1,000,000 نقطة لشحن حساباتك فورياً",
        "إطلاق حملات غير محدودة وتثبيتها بالقمة",
        "أولوية ظهور قصوى للحملات +100%",
        "أقوى خصم وتوفير مالي استثنائي بالمنصة"
      ],
      en: [
        "Dedicated 24/7 account manager",
        "1,000,000 points credited instantly",
        "Sticky topmost priority campaigns",
        "Max priority exposure +100%",
        "Ultimate savings option with premium discount"
      ],
      fr: [
        "Gestionnaire de compte dédié 24/7",
        "1 000 000 points crédités instantanément",
        "Campagnes épinglées au sommet",
        "Exposition maximale prioritaire +100%",
        "Options d'économie absolues sur la plate-forme"
      ],
      es: [
        "Gestor estricto de cuenta 24/7",
        "1,000,000 puntos cargados inmediatamente",
        "Campañas fijadas en lo más alto",
        "Exposición preferencial absoluta +100%",
        "Opción de ahorro masivo premium sin igual"
      ]
    },
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/40",
    btnColorBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
  }
];
