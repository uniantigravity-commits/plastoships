export type UserRole = 'super_admin' | 'manufacturer' | 'distributor';

export type NavScreen =
  | 'dashboard'
  | 'manufacturers'
  | 'distributors'
  | 'products'
  | 'categories'
  | 'rfqs'
  | 'orders'
  | 'subscriptions'
  | 'invoices'
  | 'payments'
  | 'cms'
  | 'reports'
  | 'settings';

export type ManufacturerNavScreen =
  | 'mfr_dashboard'
  | 'mfr_profile'
  | 'mfr_kyc'
  | 'mfr_products'
  | 'mfr_categories'
  | 'mfr_orders'
  | 'mfr_rfqs'
  | 'mfr_inventory'
  | 'mfr_subscriptions'
  | 'mfr_payments'
  | 'mfr_settings';

export type DistributorNavScreen =
  | 'dst_dashboard'
  | 'dst_profile'
  | 'dst_kyc'
  | 'dst_rfqs'
  | 'dst_quotations'
  | 'dst_orders'
  | 'dst_tracking'
  | 'dst_subscription'
  | 'dst_payments'
  | 'dst_settings'
  | 'dst_catalog';

export type KycStatus = 'Pending' | 'Approved' | 'Rejected';
export type AccountStatus = 'Active' | 'Suspended' | 'Pending Review' | 'Rejected';
export type SubscriptionTier = 'Silver' | 'Gold' | 'Diamond' | 'Starter';

export interface ManufacturerRegistrationDoc {
  id: string;
  docType: string;
  documentNumber?: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
}

export interface Manufacturer {
  id: string; // Space Mono e.g. MFR-GJ-1042
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  industrialZone: string;
  gstin: string;
  category: string;
  categories?: string[];
  kycStatus: KycStatus;
  subscription: SubscriptionTier;
  accountStatus: AccountStatus;
  registeredDate: string;
  capacityMt: number;
  kycReason?: string;
  panNumber: string;
  cinNumber: string;
  productsCount: number;

  // Sign-Up & Registration Full Application Details
  legalEntityType?: string;
  designation?: string;
  altPhone?: string;
  plantAddress?: string;
  registeredOfficeAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;
  establishedYear?: number;
  website?: string;
  powerLoadKw?: number;
  plantAreaSqFt?: number;
  productionLines?: string;
  udyamRegistrationNo?: string;
  factoryLicenseNo?: string;
  gpcbConsentNo?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
  accountHolderName?: string;
  cancelledChequeUploaded?: boolean;
  registrationDocs?: ManufacturerRegistrationDoc[];
}

export interface Distributor {
  id: string; // Space Mono e.g. DST-GJ-3021
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  businessType: 'Wholesaler' | 'Industrial Supplier' | 'Polymer Trader' | 'Retailer';
  kycStatus: KycStatus;
  status: AccountStatus;
  joinedDate: string;
  tradeVolumeYear: string;
  gstin: string;
  kycReason?: string;
  creditLimit: string;

  // Sign-Up & Registration Full Application Details
  legalEntityType?: string;
  designation?: string;
  altPhone?: string;
  panNumber?: string;
  cinNumber?: string;
  officeAddress?: string;
  warehouseAddress?: string;
  district?: string;
  state?: string;
  pincode?: string;
  establishedYear?: number;
  website?: string;
  warehouseCapacitySqFt?: number;
  monthlyProcurementMt?: number;
  targetPolymers?: string[];
  bankName?: string;
  bankAccountNo?: string;
  bankIfsc?: string;
  bankBranch?: string;
  accountHolderName?: string;
  cancelledChequeUploaded?: boolean;
  registrationDocs?: ManufacturerRegistrationDoc[];
}

export type ProductStatus = 'Approved' | 'Pending' | 'Rejected' | 'Suspended';

export interface Product {
  id: string; // Space Mono e.g. PRD-8821
  image?: string;
  productName: string;
  name?: string;
  manufacturer?: string;
  manufacturerId: string;
  manufacturerName: string;
  category: string;
  polymerGrade: string;
  grade?: string;
  pricePerKg: number;
  minOrderQuantity: string;
  status: ProductStatus;
  stockQuantity?: string;
  inStock?: boolean;
  submittedDate?: string;
  description?: string;
  rejectionReason?: string;
  hsnCode?: string;
  mfi?: string; // Melt Flow Index
  meltFlowIndex?: string;
  density?: string;
  application?: string;
  rating?: number;
  verifiedGrade?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  hsnCode: string;
  productCount: number;
  status: 'Active' | 'Inactive';
  iconName: string;
  avgPricePerKg: number;
}

export type RfqStatus = 'Open' | 'Quotes Received' | 'Negotiating' | 'Awarded' | 'Closed';

export interface RfqQuote {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  offeredPricePerKg: number;
  totalOfferAmount: number;
  deliveryTimelineDays: string;
  validityDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Counter Offered';
  remarks?: string;
}

export interface Rfq {
  id: string; // Space Mono e.g. RFQ-GJ-9410
  distributorId: string;
  distributorName: string;
  product: string;
  productName?: string;
  category: string;
  polymerType?: string;
  polymerGrade?: string;
  quantity: string;
  targetPrice: string;
  targetPricePerKg?: number;
  status: RfqStatus;
  createdDate: string;
  deadlineDate?: string;
  deliveryLocation: string;
  quotesCount: number;
  deliveryTimeline?: string;
  paymentTerms?: string;
  remarks?: string;
  notes?: string;
  quotes?: RfqQuote[];
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Completed' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string; // Space Mono e.g. ORD-GJ-7023
  rfqId?: string;
  manufacturer: string;
  manufacturerId?: string;
  manufacturerName?: string;
  distributor: string;
  distributorId?: string;
  distributorName?: string;
  distributorCity?: string;
  product: string;
  productName?: string;
  polymerGrade?: string;
  category?: string;
  quantity: string;
  unitPricePerKg?: number;
  amount: number;
  totalAmount?: number;
  orderStatus: OrderStatus;
  createdDate: string;
  orderDate?: string;
  dispatchHub?: string;
  deliveryAddress?: string;
  paymentStatus: 'Escrow Held' | 'Paid to MFR' | 'Pending' | 'Refunded' | 'Released to Manufacturer' | string;
  trackingNumber: string;
  estimatedDelivery?: string;
  transporterName?: string;
  truckNumber?: string;
  escrowLocked?: boolean;
  coaVerified?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tag: string;
  tier: SubscriptionTier;
  targetRole?: 'Manufacturer' | 'Distributor' | 'Both';
  monthlyPrice: number;
  annualPrice: number;
  maxListings: string;
  rfqAccess: string;
  verifiedBadge: boolean;
  commissionRate: string;
  prioritySupport: boolean;
  status: 'Active' | 'Inactive';
  activeSubscribersCount: number;
}

export interface SubscriptionRecord {
  id: string; // Space Mono e.g. SUB-4019
  entityType: 'Manufacturer' | 'Distributor';
  entityName: string;
  planName: string;
  amount: number;
  startDate: string;
  renewalDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
}

export interface PaymentTransaction {
  id: string; // Space Mono e.g. TXN-8923
  type: 'Subscription' | 'Order Payment' | 'Escrow Settlement';
  partyName: string;
  partyRole: 'Manufacturer' | 'Distributor';
  amount: number;
  method: 'NEFT/RTGS' | 'Razorpay B2B' | 'Escrow' | 'UPI';
  date: string;
  status: 'Success' | 'Pending' | 'Refunded';
  invoiceNumber: string; // Space Mono e.g. INV-2026-902
  referenceId: string;
}

export type InvoiceType = 'Subscription' | 'Sales';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface InvoiceLineItem {
  description: string;
  hsnSac: string;
  quantity: string | number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string; // Space Mono e.g. INV-2026-SUB-101 or INV-2026-0941
  type: InvoiceType;
  entityName: string;
  entityType: 'Manufacturer' | 'Distributor';
  entityId?: string;
  planName?: string;
  orderId?: string;
  productDescription?: string;
  billingPeriod: string;
  amount: number;
  outstandingAmount?: number;
  issuedDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  gstin?: string;
  hsnSacCode?: string;
  taxableAmount?: number;
  taxAmount?: number;
  items?: InvoiceLineItem[];
  notes?: string;
}

export interface CMSBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  colorScheme: 'Navy' | 'Orange' | 'Slate';
  targetAudience: 'All' | 'Manufacturers' | 'Distributors';
}

export interface CMSAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'Notice' | 'Update' | 'Alert';
  active: boolean;
  updatedAt: string;
}

export interface CMSFeaturedItem {
  id: string;
  type: 'Manufacturer' | 'Product';
  name: string;
  category: string;
  locationOrPrice: string;
  isFeatured: boolean;
  badge: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface ManufacturerProfileData {
  id: string; // MFR-GJ-1042
  companyName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  altPhone: string;
  city: string;
  state: string;
  pincode: string;
  industrialZone: string;
  plantAddress: string;
  gstin: string;
  panNumber: string;
  cinNumber: string;
  establishedYear: number;
  capacityMt: number;
  powerLoadKw: number;
  plantAreaSqFt: number;
  primaryCategory: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry: string;
  kycStatus: KycStatus;
  accountStatus: AccountStatus;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  accountHolderName: string;
  cancelledChequeUploaded: boolean;
  completionScore: number;
  line1?: string;
  line2?: string;
  district?: string;
  country?: string;
  factoryAddress?: string;
  website?: string;
  productCategories?: string[];
  yearsInBusiness?: number;
  manufacturingCapacityUnits?: number;
  logoFileName?: string;
  brochureFileName?: string;
}

export interface ManufacturerKycDoc {
  id: string;
  documentType: string;
  documentNumber: string;
  description: string;
  status: 'Verified' | 'In Review' | 'Required' | 'Rejected';
  uploadDate: string;
  expiryDate?: string;
  fileName: string;
  fileSize: string;
  rejectionReason?: string;
}

export interface ManufacturerInventoryItem {
  id: string; // Space Mono e.g. INV-BCH-4091
  productId?: string;
  productName: string;
  polymerGrade: string;
  category: string;
  batchNumber: string;
  warehouseLocation: string; // e.g. Silo A-02, Makansar Bay 4
  currentStockMt: number;
  reorderLevelMt: number;
  unitPricePerKg: number;
  lastUpdated: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface ManufacturerQuotation {
  id: string; // Space Mono e.g. QT-9042
  rfqId: string;
  rfqProduct?: string;
  productName?: string;
  category?: string;
  distributorName?: string;
  distributorCity?: string;
  manufacturerName?: string;
  manufacturerId?: string;
  factoryHub?: string;
  rating?: number;
  leadTime?: string;
  freightIncluded?: boolean;
  escrowProtected?: boolean;
  quantityRequested?: string;
  quantity?: string;
  quotedPricePerKg?: number;
  quotedUnitPrice?: number;
  totalQuoteAmount?: number;
  totalQuotationAmount?: number;
  totalOrderValue?: number;
  totalAmount?: number;
  freightTerms?: 'Ex-Factory' | 'FOR Destination' | 'Shared 50/50' | string;
  freightAmount?: number;
  paymentTerms?: string;
  deliveryLeadDays?: number;
  deliveryLeadTimeDays?: number;
  deliveryDays?: number;
  validUntil: string;
  validityDate?: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Declined' | 'Pending Review' | 'Counter Offered';
  notes?: string;
  remarks?: string;
  submittedAt?: string;
}

export interface ManufacturerSettlement {
  id: string; // Space Mono e.g. STL-2026-883
  orderId: string;
  distributorName?: string;
  orderProduct?: string;
  grossAmount: number;
  platformFee?: number;
  platformFeeDeducted?: number;
  gstTdsDeduction?: number;
  tdsDeducted?: number;
  netSettledAmount: number;
  settlementDate: string;
  bankUtr?: string;
  utrReference?: string; // Space Mono e.g. UTR-HDFC-9912048
  status: 'Settled to Bank' | 'Processing' | 'Escrow Held' | 'Settled' | 'In Escrow';
  bankAccountLast4?: string;
}

export interface DistributorProfileData {
  id: string; // DST-94821 - IND
  companyName: string;
  legalName?: string;
  contactPerson: string;
  primaryContactPerson?: string;
  designation: string;
  email: string;
  phone: string;
  altPhone?: string;
  city: string;
  state: string;
  pincode: string;
  industrialZone: string;
  officeAddress: string;
  gstin: string;
  panNumber: string;
  pan?: string;
  businessType: 'Wholesaler' | 'Polymer Trader' | 'Industrial Supplier' | 'Retailer' | string;
  tradeVolumeYear: string;
  annualSourcingVolume?: string;
  annualTurnover?: string;
  establishedYear?: number;
  subscriptionTier?: string;
  totalOrdersPlaced?: number;
  categoriesOfInterest?: string[];
  creditLimit: string;
  availableCredit?: string;
  lockedEscrow?: string;
  tier?: string;
  verifiedLevel?: string;
  kycStatus: KycStatus;
  accountStatus: AccountStatus;
  defaultDeliveryHub: string;
  deliveryHubDetails?: string;
  bankName: string;
  bankAccountNo: string;
  bankIfsc: string;
  bankBranch: string;
  accountHolderName: string;
  completionScore: number;
}

export interface DistributorTransaction {
  id: string; // TXN-99812
  date: string;
  referencePo: string;
  type: string;
  amount: number;
  escrowStatus: 'In Escrow Vault' | 'Active 45-day Credit' | 'Completed & Closed' | 'Pending Settlement';
  statusColor?: string;
}

export interface DistributorKycDoc {
  id: string;
  documentType: string;
  documentNumber: string;
  description: string;
  status: 'Verified' | 'In Review' | 'Required' | 'Rejected';
  uploadDate: string;
  expiryDate?: string;
  fileName: string;
  fileSize: string;
  rejectionReason?: string;
}

export interface DistributorEscrowPayment {
  id: string; // Space Mono e.g. ESC-GJ-8092
  orderId: string;
  orderProduct: string;
  manufacturerName: string;
  quantity: string;
  grossAmount: number;
  escrowDepositDate: string;
  escrowStatus: 'Funds in Escrow' | 'Released to Manufacturer' | 'Refunded';
  paymentMethod: 'Razorpay B2B' | 'Virtual Escrow Account' | 'NEFT/RTGS';
  utrNumber: string;
  releaseDate?: string;
}

export interface DistributorDeliveryAddress {
  id: string;
  label: string;
  contactName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}
