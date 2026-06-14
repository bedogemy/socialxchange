export type CampaignType = string;

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  points: number;
  dollars?: number; // Represent user's profit converted from points
  passwordText?: string; // Storing password to fulfill "retrieve actual password" requirement
  createdAt: number;
}

export interface Campaign {
  id: string;
  creatorId: string;
  creatorEmail: string;
  type: CampaignType;
  youtubeUrl: string;
  youtubeId: string; // Video ID for Youtube
  title: string;
  duration: number; // 60 | 120 | 180 | 240 | 300
  pointsPerAction: number; // Cost to owner
  rewardPerAction: number; // Earned by performer
  quantity: number; // Goal count
  completedCount: number; // Completed so far
  status: 'active' | 'completed' | 'paused';
  customFields?: { id: string; label: string; value: string }[]; // Dynamic custom fields
  taskType?: 'subscription' | 'view' | 'like' | 'follow' | 'other';
  isFeatured?: boolean;
  createdAt: number;
}

export interface ActionHistory {
  id: string; // userId_campaignId
  userId: string;
  campaignId: string;
  type: CampaignType;
  pointsEarned: number;
  createdAt: number;
  profileHandle?: string;
}

export interface CryptoPremiumPackage {
  id: string;
  points: number;
  priceUSD: number;
}

export interface CryptoPayment {
  id: string;
  userId: string;
  userEmail: string;
  packagePoints: number;
  packagePrice: number;
  cryptoCurrency: 'BTC' | 'ETH' | 'DOGE' | 'TRX' | 'USDT' | 'VF_CASH' | 'ET_CASH' | 'OR_CASH' | 'WE_CASH' | 'INSTAPAY';
  transactionHash: string;
  screenshotUrl?: string; // Stored user proof or notes
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  rejectReason?: string;  // Explicit refund/reject reason provided by admin
}

export interface AdminSettings {
  btcAddress: string;
  ethAddress: string;
  dogeAddress: string;
  trxAddress: string;
  usdtAddress: string;
  vodafoneCash: string;
  etisalatCash: string;
  orangeCash: string;
  weCash: string;
  instapay: string;
  supportEmail: string;
  facebookPageUrl: string;
  // Configurable rates per action (points cost and reward payout points)
  pointsPerActionConfig?: Record<string, { pointsPerAction: number; rewardPerAction: number }>;
  // Dynamic admin-defined campaign platforms
  customPlatforms?: { 
    id: string; 
    name: string; 
    nameEn?: string; 
    icon?: string; 
    urlPlaceholder?: string; 
    titlePlaceholder?: string;
    urlLabel?: string;
    pointsPerAction?: number;
    rewardPerAction?: number;
  }[];
  // Dynamic social accounts linking platforms
  socialLinkPlatforms?: {
    id: string;
    name: string;
    desc: string;
    place: string;
    icon?: string;
    isActive: boolean;
  }[];
  // Dynamic customizable support platforms
  supportPlatforms?: {
    id: string;
    name: string;
    url: string;
    icon: string;
    isActive: boolean;
  }[];
  // Dynamic point conversion rates
  exchangeRates?: {
    points: number;
    dollars: number;
    label: string;
  }[];
  purchasePackages?: {
    id: string;
    name: string;
    points: number;
    price: number;
    desc: string;
    features?: string[];
  }[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  pointsExchanged: number;
  dollarsEarned: number;
  method: 'BTC' | 'ETH' | 'DOGE' | 'TRX' | 'USDT' | 'VF_CASH' | 'ET_CASH' | 'OR_CASH' | 'WE_CASH' | 'INSTAPAY';
  walletOrPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  type?: 'conversion' | 'withdrawal';
}

export interface UserReview {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  userPhotoURL?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: number;
}

export interface UserComplaint {
  id: string;
  userId: string;
  userEmail: string;
  displayName: string;
  subject: string;
  message: string;
  createdAt: number;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  position: 'header' | 'sidebar' | 'footer';
  widthClass: string; // e.g., max-w-[728px] or max-w-[250px]
  heightClass: string; // e.g., h-[90px] or h-[250px]
  createdAt: number;
}

export interface TaskVerification {
  id: string;
  userId: string;
  userEmail: string;
  campaignId: string;
  campaignTitle: string;
  campaignType: string;
  rewardPoints: number;
  screenshotBase64: string;
  profileHandle: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  taskId?: string;
  taskType?: string;
  taskUrl?: string;
}

