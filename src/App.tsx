import React, { useState } from 'react';
import {
  NavScreen,
  UserRole,
  Manufacturer,
  Distributor,
  Product,
  Category,
  Rfq,
  Order,
  OrderStatus,
  SubscriptionPlan,
  SubscriptionRecord,
  PaymentTransaction,
  CMSBanner,
  CMSAnnouncement,
  CMSFeaturedItem,
  ToastMessage,
  ManufacturerProfileData,
  ManufacturerKycDoc,
  ManufacturerInventoryItem,
  ManufacturerQuotation,
  ManufacturerSettlement,
  DistributorProfileData,
  DistributorKycDoc,
  DistributorEscrowPayment,
  DistributorDeliveryAddress,
  Invoice,
} from './types';
import {
  INITIAL_MANUFACTURERS,
  INITIAL_DISTRIBUTORS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_RFQS,
  INITIAL_ORDERS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIPTION_RECORDS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_CMS_BANNERS,
  INITIAL_CMS_ANNOUNCEMENTS,
  INITIAL_CMS_FEATURED,
  INITIAL_RECENT_ACTIVITIES,
  INITIAL_MFR_PROFILE,
  INITIAL_MFR_KYC_DOCS,
  INITIAL_MFR_INVENTORY,
  INITIAL_MFR_QUOTATIONS,
  INITIAL_MFR_SETTLEMENTS,
  INITIAL_MFR_ACTIVITIES,
  INITIAL_DISTRIBUTOR_PROFILE,
  INITIAL_DISTRIBUTOR_KYC_DOCS,
  INITIAL_DISTRIBUTOR_ESCROW_PAYMENTS,
  INITIAL_DISTRIBUTOR_ADDRESSES,
  INITIAL_DISTRIBUTOR_ACTIVITIES,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { DashboardScreen } from './screens/DashboardScreen';
import { ManufacturerScreen } from './screens/ManufacturerScreen';
import { DistributorScreen } from './screens/DistributorScreen';
import { ProductScreen } from './screens/ProductScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { RfqScreen } from './screens/RfqScreen';
import { OrderScreen } from './screens/OrderScreen';
import { SubscriptionScreen } from './screens/SubscriptionScreen';
import { InvoiceScreen } from './screens/InvoiceScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { CmsScreen } from './screens/CmsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LoginScreen } from './screens/LoginScreen';

// Manufacturer Screens
import { MfrDashboardScreen } from './screens/manufacturer/MfrDashboardScreen';
import { MfrProfileScreen } from './screens/manufacturer/MfrProfileScreen';
import { MfrKycScreen } from './screens/manufacturer/MfrKycScreen';
import { MfrProductsScreen } from './screens/manufacturer/MfrProductsScreen';
import { MfrOrdersScreen } from './screens/manufacturer/MfrOrdersScreen';
import { MfrInventoryScreen } from './screens/manufacturer/MfrInventoryScreen';
import { MfrSubscriptionScreen } from './screens/manufacturer/MfrSubscriptionScreen';
import { MfrPaymentsScreen } from './screens/manufacturer/MfrPaymentsScreen';
import { MfrSettingsScreen } from './screens/manufacturer/MfrSettingsScreen';

// Distributor Screens & Modals
import { DistributorDashboardScreen } from './screens/distributor/DistributorDashboardScreen';
import { DistributorProfileScreen } from './screens/distributor/DistributorProfileScreen';
import { DistributorCatalogScreen } from './screens/distributor/DistributorCatalogScreen';
import { DistributorRfqScreen } from './screens/distributor/DistributorRfqScreen';
import { DistributorOrdersScreen } from './screens/distributor/DistributorOrdersScreen';
import { DistributorSubscriptionScreen } from './screens/distributor/DistributorSubscriptionScreen';
import { DistributorPaymentsScreen } from './screens/distributor/DistributorPaymentsScreen';
import { DistributorKycScreen } from './screens/distributor/DistributorKycScreen';
import { DistributorChangePasswordScreen } from './screens/distributor/DistributorChangePasswordScreen';
import { DistributorSettingsScreen } from './screens/distributor/DistributorSettingsScreen';
import { DistributorProfileModal } from './components/distributor/DistributorProfileModal';
import { ManufacturerProfileModal } from './components/manufacturer/ManufacturerProfileModal';
import { AdminProfileModal } from './components/admin/AdminProfileModal';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('super_admin');
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDstProfileModalOpen, setIsDstProfileModalOpen] = useState(false);
  const [isMfrProfileModalOpen, setIsMfrProfileModalOpen] = useState(false);
  const [isAdminProfileModalOpen, setIsAdminProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Notifications / Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // State collections for Super Admin
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(INITIAL_MANUFACTURERS);
  const [distributors, setDistributors] = useState<Distributor[]>(INITIAL_DISTRIBUTORS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [rfqs, setRfqs] = useState<Rfq[]>(INITIAL_RFQS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [subscriptionRecords, setSubscriptionRecords] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTION_RECORDS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [cmsBanners, setCmsBanners] = useState<CMSBanner[]>(INITIAL_CMS_BANNERS);
  const [cmsAnnouncements, setCmsAnnouncements] = useState<CMSAnnouncement[]>(INITIAL_CMS_ANNOUNCEMENTS);
  const [cmsFeatured, setCmsFeatured] = useState<CMSFeaturedItem[]>(INITIAL_CMS_FEATURED);
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITIES);

  // State collections for Manufacturer Panel
  const [mfrProfile, setMfrProfile] = useState<ManufacturerProfileData>(INITIAL_MFR_PROFILE);
  const [mfrKycDocs, setMfrKycDocs] = useState<ManufacturerKycDoc[]>(INITIAL_MFR_KYC_DOCS);
  const [mfrInventory, setMfrInventory] = useState<ManufacturerInventoryItem[]>(INITIAL_MFR_INVENTORY);
  const [mfrQuotations, setMfrQuotations] = useState<ManufacturerQuotation[]>(INITIAL_MFR_QUOTATIONS);
  const [mfrSettlements, setMfrSettlements] = useState<ManufacturerSettlement[]>(INITIAL_MFR_SETTLEMENTS);
  const [mfrActivities] = useState(INITIAL_MFR_ACTIVITIES);
  const [activeQuoteRfq, setActiveQuoteRfq] = useState<Rfq | null>(null);

  // State collections for Distributor Panel
  const [dstProfile, setDstProfile] = useState<DistributorProfileData>(INITIAL_DISTRIBUTOR_PROFILE);
  const [dstKycDocs, setDstKycDocs] = useState<DistributorKycDoc[]>(INITIAL_DISTRIBUTOR_KYC_DOCS);
  const [dstEscrowPayments, setDstEscrowPayments] = useState<DistributorEscrowPayment[]>(INITIAL_DISTRIBUTOR_ESCROW_PAYMENTS);
  const [dstAddresses, setDstAddresses] = useState<DistributorDeliveryAddress[]>(INITIAL_DISTRIBUTOR_ADDRESSES);
  const [dstActivities] = useState(INITIAL_DISTRIBUTOR_ACTIVITIES);
  const [initialOpenRfqModal, setInitialOpenRfqModal] = useState(false);

  // Role switch handler
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'super_admin') {
      setCurrentScreen('dashboard');
      showToast('Switched to Super Admin', 'Full Gujarat marketplace administrative view enabled.', 'info');
    } else if (role === 'manufacturer') {
      setCurrentScreen('mfr_dashboard');
      showToast('Switched to Manufacturer Panel', `Logged in as ${mfrProfile.companyName} (${mfrProfile.id})`, 'success');
    } else if (role === 'distributor') {
      setCurrentScreen('dst_dashboard');
      showToast('Switched to Distributor Panel', `Logged in as ${dstProfile.companyName} (${dstProfile.id})`, 'info');
    }
  };

  // Pending counts for Super Admin badges
  const pendingCounts = {
    manufacturers: manufacturers.filter((m) => m.kycStatus === 'Pending').length,
    distributors: distributors.filter((d) => d.kycStatus === 'Pending').length,
    products: products.filter((p) => p.status === 'Pending').length,
    rfqs:
      userRole === 'distributor'
        ? rfqs.filter((r) => r.quotes && r.quotes.length > 0 && r.status === 'Quotes Received').length
        : rfqs.filter((r) => r.status === 'Open' || r.status === 'Quotes Received').length,
    orders:
      userRole === 'distributor'
        ? orders.filter((o) => o.orderStatus === 'In Transit' || o.orderStatus === 'Confirmed').length
        : orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length,
    inventoryAlerts: mfrInventory.filter((i) => i.availableStockMT <= i.safetyStockMT).length,
  };

  const pendingTotal =
    pendingCounts.manufacturers +
    pendingCounts.distributors +
    pendingCounts.products +
    pendingCounts.rfqs +
    pendingCounts.orders;

  // ----------------------------------------------------
  // MANUFACTURER SPECIFIC HANDLERS
  // ----------------------------------------------------
  const handleUpdateMfrProfile = (updated: ManufacturerProfileData) => {
    setMfrProfile(updated);
    showToast('Plant Profile Updated', 'Company details and plant technical specifications saved.');
  };

  const handleUploadMfrKycDoc = (doc: ManufacturerKycDoc) => {
    setMfrKycDocs((prev) => [doc, ...prev]);
    showToast('Document Submitted', `${doc.documentType} uploaded for PlastoShip compliance audit.`);
  };

  const handleAddMfrProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    showToast('Product Created', `${prod.productName} (${prod.polymerGrade}) added to catalog.`);
  };

  const handleUpdateMfrProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Product Updated', `${updated.productName} pricing and specifications saved.`);
  };

  const handleDeleteMfrProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product Removed', `SKU ${id} deleted from your plant catalog.`, 'error');
  };

  const handleMfrUpdateOrderStatus = (orderId: string, status: OrderStatus, trackingNo?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, orderStatus: status, trackingNumber: trackingNo || o.trackingNumber }
          : o
      )
    );
    showToast('Consignment Dispatched', `Order ${orderId} marked as dispatched with LR: ${trackingNo}.`);
  };

  const handleSubmitMfrQuote = (quote: ManufacturerQuotation) => {
    setMfrQuotations((prev) => [quote, ...prev]);
    // update rfq status
    setRfqs((prev) =>
      prev.map((r) => (r.id === quote.rfqId ? { ...r, status: 'Quotes Received' } : r))
    );
    showToast('Quotation Submitted', `Commercial bid of ₹${quote.quotedPricePerKg}/Kg dispatched to ${quote.distributorName}.`);
  };

  const handleAddMfrStock = (item: ManufacturerInventoryItem) => {
    setMfrInventory((prev) => [item, ...prev]);
    showToast('Stock Batch Created', `Batch ${item.batchNumber} added with ${item.currentStockMt} MT.`);
  };

  const handleUpdateMfrStock = (updated: ManufacturerInventoryItem) => {
    setMfrInventory((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    showToast('Stock Level Adjusted', `${updated.productName} (${updated.batchNumber}) updated to ${updated.currentStockMt} MT.`);
  };

  // ----------------------------------------------------
  // DISTRIBUTOR SPECIFIC HANDLERS
  // ----------------------------------------------------
  const handleCreateDstRfq = (newRfq: Partial<Rfq>) => {
    const fullRfq: Rfq = {
      id: newRfq.id || `RFQ-GJ-2026-${Math.floor(100 + Math.random() * 900)}`,
      distributorId: dstProfile.id,
      distributorName: dstProfile.companyName,
      product: newRfq.product || newRfq.productName || 'HDPE Injection Molding Granules',
      productName: newRfq.productName || newRfq.product || 'HDPE Injection Molding Granules',
      category: newRfq.category || 'HDPE',
      polymerType: newRfq.polymerType || 'HDPE',
      polymerGrade: newRfq.polymerGrade || 'Blow/Injection Grade',
      quantity: newRfq.quantity || '25 MT',
      targetPrice: newRfq.targetPrice || `₹${newRfq.targetPricePerKg || 112}/kg`,
      targetPricePerKg: newRfq.targetPricePerKg || 112,
      deliveryLocation: newRfq.deliveryLocation || `${dstProfile.city}, Gujarat`,
      deliveryTimeline: newRfq.deliveryTimeline || 'Within 7 Days',
      paymentTerms: newRfq.paymentTerms || '100% Escrow on Dispatch',
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
      deadlineDate: newRfq.deadlineDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      quotesCount: 0,
      remarks: newRfq.remarks || newRfq.notes || 'Bulk polymer requirement for manufacturing plant.',
      notes: newRfq.notes,
      quotes: [],
    };
    setRfqs((prev) => [fullRfq, ...prev]);
    showToast('RFQ Broadcasted', `${fullRfq.id} has been published to verified polymer plants in Gujarat.`);
  };

  const handleInstantDstOrder = (order: Partial<Order>) => {
    const orderAmount = order.totalAmount || order.amount || 1140000;
    const prodName = order.productName || order.product || 'HDPE Granules';
    const mfrName = order.manufacturerName || order.manufacturer || 'Gujarat Polychem Industries Ltd';
    const newOrder: Order = {
      id: order.id || `ORD-GJ-${Math.floor(7000 + Math.random() * 900)}`,
      distributor: dstProfile.companyName,
      distributorId: dstProfile.id,
      distributorName: dstProfile.companyName,
      distributorCity: dstProfile.city,
      manufacturer: mfrName,
      manufacturerId: order.manufacturerId || 'MFR-GJ-1002',
      manufacturerName: mfrName,
      product: prodName,
      productName: prodName,
      polymerGrade: order.polymerGrade || 'MFI 0.35 High Impact',
      quantity: order.quantity || '10 MT',
      unitPricePerKg: order.unitPricePerKg || 114,
      amount: orderAmount,
      totalAmount: orderAmount,
      paymentStatus: 'Escrow Held',
      orderStatus: 'Confirmed',
      createdDate: new Date().toISOString().split('T')[0],
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dispatchHub: 'Sanand Industrial Rail Hub',
      deliveryAddress: order.deliveryAddress || `${dstProfile.officeAddress}`,
      trackingNumber: `TRK-GJ-${Math.floor(90000 + Math.random() * 9999)}`,
      estimatedDelivery: '3 Days',
      transporterName: 'Gujarat Roadways Logistics',
      truckNumber: 'GJ-01-XX-9021',
      escrowLocked: true,
      coaVerified: true,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create Escrow entry
    const newEscrow: DistributorEscrowPayment = {
      id: `ESC-GJ-${Math.floor(8100 + Math.random() * 900)}`,
      orderId: newOrder.id,
      orderProduct: `${newOrder.productName} (${newOrder.polymerGrade})`,
      manufacturerName: newOrder.manufacturerName || newOrder.manufacturer,
      quantity: newOrder.quantity,
      grossAmount: newOrder.totalAmount || newOrder.amount,
      escrowDepositDate: newOrder.orderDate || newOrder.createdDate,
      escrowStatus: 'Funds in Escrow',
      paymentMethod: 'Razorpay B2B',
      utrNumber: `UTR-HDFC-${Math.floor(99000000 + Math.random() * 999999)}`,
    };
    setDstEscrowPayments((prev) => [newEscrow, ...prev]);

    showToast(
      'Purchase Order Placed',
      `Order ${newOrder.id} placed. ₹${newOrder.amount.toLocaleString('en-IN')} deposited safely in Escrow.`
    );
  };

  const handleAcceptQuote = (quoteOrRfqId: any, rfqOrQuoteId?: any) => {
    let quote: any = null;
    let rfq: any = null;

    if (typeof quoteOrRfqId === 'object' && quoteOrRfqId !== null) {
      quote = quoteOrRfqId;
      rfq = rfqOrQuoteId || rfqs.find((r) => r.id === quote.rfqId);
    } else {
      const rfqId = quoteOrRfqId;
      const quoteId = rfqOrQuoteId;
      rfq = rfqs.find((r) => r.id === rfqId);
      quote = rfq?.quotes?.find((q: any) => q.id === quoteId) || mfrQuotations.find((q) => q.id === quoteId);
    }

    if (!quote) return;

    const quoteId = quote.id;
    const rfqId = rfq?.id || quote.rfqId;

    // Update RFQ status
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          const updatedQuotes = r.quotes?.map((q) =>
            q.id === quoteId ? { ...q, status: 'Accepted' as const } : { ...q, status: 'Rejected' as const }
          );
          return { ...r, status: 'Awarded' as const, quotes: updatedQuotes };
        }
        return r;
      })
    );

    // Update mfrQuotations status
    setMfrQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          return { ...q, status: 'Accepted' as const };
        }
        if (rfqId && q.rfqId === rfqId) {
          return { ...q, status: 'Declined' as const };
        }
        return q;
      })
    );

    // Create Order
    const unitPrice = quote.quotedUnitPrice || quote.quotedPricePerKg || quote.offeredPricePerKg || 372;
    const totalAmount = quote.totalOrderValue || quote.totalQuotationAmount || quote.totalOfferAmount || unitPrice * 3000;
    const newOrder: Order = {
      id: `PO-2026-${Math.floor(88000 + Math.random() * 999)}`,
      rfqId: rfqId,
      distributor: dstProfile.companyName,
      distributorId: dstProfile.id,
      distributorName: dstProfile.companyName,
      distributorCity: dstProfile.city,
      manufacturer: quote.manufacturerName || quote.distributorName || 'Selected Plant',
      manufacturerId: quote.manufacturerId || 'MFR-SUPREME',
      manufacturerName: quote.manufacturerName || quote.distributorName || 'Selected Plant',
      product: quote.productName || rfq?.product || rfq?.productName || 'Polymer Consignment',
      productName: quote.productName || rfq?.productName || rfq?.product || 'Polymer Consignment',
      category: quote.category || rfq?.category || 'Storage Containers',
      polymerGrade: rfq?.polymerGrade || 'Virgin HDPE Grade',
      quantity: quote.quantity || rfq?.quantity || '3,000 Units',
      unitPricePerKg: unitPrice,
      amount: totalAmount,
      totalAmount: totalAmount,
      paymentStatus: 'Escrow Held',
      orderStatus: 'Confirmed',
      createdDate: new Date().toISOString().split('T')[0],
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      dispatchHub: quote.factoryHub || 'Bhiwandi Central Fulfillment Hub (MH-04)',
      deliveryAddress: dstProfile.officeAddress,
      trackingNumber: `TRK-PL-${Math.floor(9000000 + Math.random() * 999999)}`,
      estimatedDelivery: quote.leadTime || '6 Days Lead Time',
      transporterName: 'Gujarat Roadways Logistics',
      truckNumber: 'GJ-01-XX-9021',
      escrowLocked: true,
      coaVerified: true,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Create Escrow
    const newEscrow: DistributorEscrowPayment = {
      id: `ESC-GJ-${Math.floor(8100 + Math.random() * 900)}`,
      orderId: newOrder.id,
      orderProduct: `${newOrder.productName}`,
      manufacturerName: newOrder.manufacturerName || newOrder.manufacturer,
      quantity: newOrder.quantity,
      grossAmount: newOrder.totalAmount || newOrder.amount,
      escrowDepositDate: newOrder.orderDate || newOrder.createdDate,
      escrowStatus: 'Funds in Escrow',
      paymentMethod: 'Razorpay B2B',
      utrNumber: `UTR-HDFC-${Math.floor(99000000 + Math.random() * 999999)}`,
    };
    setDstEscrowPayments((prev) => [newEscrow, ...prev]);

    showToast('Purchase Order Issued', `Order ${newOrder.id} generated for ${newOrder.manufacturerName}. ₹${newOrder.amount.toLocaleString('en-IN')} deposited in Escrow.`);
  };

  const handleDeclineQuote = (quoteId: string, reason?: string) => {
    setMfrQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: 'Declined' as const } : q))
    );
    showToast('Quotation Declined', `Quotation ${quoteId} marked declined.${reason ? ` Reason: ${reason}` : ''}`, 'info');
  };

  const handleNegotiateQuote = (rfqId: string, quoteId: string, counterPrice: number) => {
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId) {
          const updatedQuotes = r.quotes?.map((q) =>
            q.id === quoteId
              ? { ...q, status: 'Counter Offered' as const, remarks: `Buyer counter-offer: ₹${counterPrice}/kg` }
              : q
          );
          return { ...r, quotes: updatedQuotes };
        }
        return r;
      })
    );
    showToast('Counter Offer Dispatched', `Proposed ₹${counterPrice}/kg to manufacturer.`);
  };

  const handleConfirmDelivery = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, orderStatus: 'Delivered', paymentStatus: 'Released to Manufacturer' }
          : o
      )
    );

    setDstEscrowPayments((prev) =>
      prev.map((p) =>
        p.orderId === orderId ? { ...p, escrowStatus: 'Released to Manufacturer' } : p
      )
    );

    showToast('Delivery & QC Approved', `Order ${orderId} marked Delivered. Escrow funds released to Plant supplier.`);
  };

  const handleDepositEscrow = (payment: Partial<DistributorEscrowPayment>) => {
    const fullPay: DistributorEscrowPayment = {
      id: payment.id || `ESC-GJ-${Math.floor(8100 + Math.random() * 900)}`,
      orderId: payment.orderId || 'ORD-GJ-7041',
      orderProduct: payment.orderProduct || 'HDPE Granules',
      manufacturerName: payment.manufacturerName || 'Morbi Polymer Extrusions Pvt Ltd',
      quantity: payment.quantity || '15 MT',
      grossAmount: payment.grossAmount || 1500000,
      escrowDepositDate: payment.escrowDepositDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
      escrowStatus: 'Funds in Escrow',
      paymentMethod: payment.paymentMethod || 'Razorpay B2B',
      utrNumber: payment.utrNumber || `UTR-HDFC-${Math.floor(99000000 + Math.random() * 999999)}`,
    };
    setDstEscrowPayments((prev) => [fullPay, ...prev]);
    showToast('Escrow Deposit Successful', `₹${fullPay.grossAmount.toLocaleString('en-IN')} deposited for ${fullPay.orderId}.`);
  };

  const handleUpdateDstProfile = (updated: Partial<DistributorProfileData>) => {
    setDstProfile((prev) => ({ ...prev, ...updated }));
    showToast('Wholesaler Profile Updated', 'Business legal details and contact information saved.');
  };

  const handleOpenProfileModal = () => {
    if (userRole === 'manufacturer') {
      setIsMfrProfileModalOpen(true);
    } else if (userRole === 'distributor') {
      setIsDstProfileModalOpen(true);
    } else {
      setIsAdminProfileModalOpen(true);
    }
  };

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleUploadDstKycDoc = (doc: Partial<DistributorKycDoc>) => {
    const fullDoc: DistributorKycDoc = {
      id: doc.id || `DST-DOC-${Math.floor(10 + Math.random() * 90)}`,
      documentType: doc.documentType || 'GSTIN Certificate (REG-06)',
      documentNumber: doc.documentNumber || '24ABFPS1092M1ZK',
      description: doc.description || 'Uploaded registration document',
      status: 'In Review',
      uploadDate: new Date().toISOString().split('T')[0],
      fileName: doc.fileName || 'compliance_document.pdf',
      fileSize: doc.fileSize || '1.2 MB',
    };
    setDstKycDocs((prev) => [fullDoc, ...prev]);
    showToast('Compliance Document Uploaded', `${fullDoc.documentType} sent for verification.`);
  };

  const handleAddDstAddress = (newAddr: DistributorDeliveryAddress) => {
    setDstAddresses((prev) => [...prev, newAddr]);
    showToast('Warehouse Depot Added', `${newAddr.label} is now active for deliveries.`);
  };

  const handleDeleteDstAddress = (id: string) => {
    setDstAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Warehouse Removed', 'Depot address deleted.');
  };

  const handleSetDefaultDstAddress = (id: string) => {
    setDstAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default Depot Updated', 'New primary delivery destination configured.');
  };

  // ----------------------------------------------------
  // SUPER ADMIN HANDLERS
  // ----------------------------------------------------
  const handleApproveManufacturer = (id: string) => {
    setManufacturers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, kycStatus: 'Approved', accountStatus: 'Active', kycReason: undefined }
          : m
      )
    );
    showToast('Manufacturer KYC Approved', `Plant ${id} verified for direct trading on PlastoShip Gujarat.`);
  };

  const handleRejectManufacturer = (id: string, reason: string) => {
    setManufacturers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, kycStatus: 'Rejected', accountStatus: 'Rejected', kycReason: reason }
          : m
      )
    );
    showToast('Manufacturer KYC Rejected', `Notice sent to plant with reason: ${reason}`, 'error');
  };

  const handleToggleSuspendManufacturer = (id: string) => {
    setManufacturers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.accountStatus === 'Active' ? 'Suspended' : 'Active';
          showToast(
            nextStatus === 'Suspended' ? 'Account Suspended' : 'Account Restored',
            `${m.companyName} is now ${nextStatus.toLowerCase()}.`,
            nextStatus === 'Suspended' ? 'error' : 'success'
          );
          return { ...m, accountStatus: nextStatus };
        }
        return m;
      })
    );
  };

  const handleUpdateManufacturerCategories = (id: string, newCategories: string[]) => {
    setManufacturers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              categories: newCategories,
              category: newCategories.join(' & '),
            }
          : m
      )
    );
    showToast('Categories Updated', `Updated product categories for manufacturer ${id}`);
  };

  const handleApproveDistributor = (id: string) => {
    setDistributors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, kycStatus: 'Approved', status: 'Active', kycReason: undefined } : d))
    );
    showToast('Distributor KYC Approved', `Buyer ${id} unlocked for bidding and placing escrow orders.`);
  };

  const handleRejectDistributor = (id: string, reason: string) => {
    setDistributors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, kycStatus: 'Rejected', status: 'Rejected', kycReason: reason } : d))
    );
    showToast('Distributor KYC Rejected', `Notice dispatched with reason: ${reason}`, 'error');
  };

  const handleToggleSuspendDistributor = (id: string) => {
    setDistributors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'Active' ? 'Suspended' : 'Active';
          showToast(
            nextStatus === 'Suspended' ? 'Distributor Suspended' : 'Distributor Reactivated',
            `${d.companyName} purchasing account is now ${nextStatus.toLowerCase()}.`,
            nextStatus === 'Suspended' ? 'error' : 'success'
          );
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const handleApproveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Approved', rejectionReason: undefined } : p))
    );
    showToast('Product Listing Approved', `Catalog item ${id} is now publicly discoverable in Gujarat.`);
  };

  const handleRejectProduct = (id: string, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Rejected', rejectionReason: reason } : p))
    );
    showToast('Product Listing Rejected', `Product returned to seller: ${reason}`, 'error');
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('Product Updated', `${updated.name} details and pricing saved.`);
  };

  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const id = `CAT-0${categories.length + 1}`;
    setCategories((prev) => [...prev, { ...newCat, id }]);
    showToast('Polymer Category Created', `Added ${newCat.name} to marketplace taxonomy.`);
  };

  const handleEditCategory = (cat: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    showToast('Category Updated', `${cat.name} specifications updated.`);
  };

  const handleToggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Inactive' : 'Active';
          showToast('Category Status Updated', `${c.name} is now ${nextStatus.toLowerCase()}.`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          let paymentStatus = o.paymentStatus;
          if (nextStatus === 'Completed') {
            paymentStatus = 'Paid to MFR';
          }
          showToast('Order Status Updated', `${orderId} marked as ${nextStatus}.`);
          return { ...o, orderStatus: nextStatus, paymentStatus };
        }
        return o;
      })
    );
  };

  const handleCreatePlan = (plan: Omit<SubscriptionPlan, 'id' | 'activeSubscribersCount'>) => {
    const id = `PLAN-${plan.name.toUpperCase().replace(/\s+/g, '-')}`;
    setSubscriptionPlans((prev) => [...prev, { ...plan, id, activeSubscribersCount: 0 }]);
    showToast('Membership Plan Created', `${plan.name} is now available for regional plants.`);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
    showToast('Plan Parameters Updated', `${plan.name} rates and listing limits modified.`);
  };

  const handleTogglePlanStatus = (id: string) => {
    setSubscriptionPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = p.status === 'Active' ? 'Inactive' : 'Active';
          showToast('Plan Visibility Changed', `${p.name} is now ${next.toLowerCase()}.`);
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  const handleToggleBanner = (id: string) => {
    setCmsBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
    showToast('Banner Display Toggled', 'Homepage promotional banner status updated.');
  };

  const handleAddBanner = (banner: Omit<CMSBanner, 'id'>) => {
    const id = `BNR-0${cmsBanners.length + 1}`;
    setCmsBanners((prev) => [...prev, { ...banner, id }]);
    showToast('Campaign Banner Added', `${banner.title} published to portal.`);
  };

  const handleToggleAnnouncement = (id: string) => {
    setCmsAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    showToast('Circular Broadcast Updated', 'Regional bulletin updated.');
  };

  const handleAddAnnouncement = (ann: Omit<CMSAnnouncement, 'id' | 'updatedAt'>) => {
    const id = `ANN-0${cmsAnnouncements.length + 1}`;
    const today = new Date().toISOString().split('T')[0];
    setCmsAnnouncements((prev) => [{ ...ann, id, updatedAt: today }, ...prev]);
    showToast('Notice Broadcasted', `${ann.title} dispatched to Gujarat dashboard.`);
  };

  const handleToggleFeatured = (id: string) => {
    setCmsFeatured((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFeatured: !f.isFeatured } : f))
    );
    showToast('Spotlight Item Updated', 'Featured marketplace items refreshed.');
  };

  // If logged out, display clean Login Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={(role) => {
          setIsLoggedIn(true);
          if (role) {
            handleRoleChange(role);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#0B1F3A] flex" data-panel={userRole}>
      {/* Persistent Left Navigation Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        currentRole={userRole}
        onNavigate={(screen) => {
          if (
            screen === 'dst_password' ||
            screen === 'dst_change_password' ||
            screen === 'change_password' ||
            screen === 'mfr_password'
          ) {
            handleOpenChangePasswordModal();
            return;
          }
          if (
            screen === 'profile' ||
            screen === 'dst_profile' ||
            screen === 'mfr_profile' ||
            screen === 'user_profile'
          ) {
            handleOpenProfileModal();
            return;
          }
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          showToast('Signed Out', 'You have securely signed out of PlastoShip.', 'info');
        }}
        pendingCounts={pendingCounts}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <Header
          currentScreen={currentScreen}
          currentRole={userRole}
          onSwitchRole={handleRoleChange}
          onNavigate={(screen) => {
            if (
              screen === 'dst_password' ||
              screen === 'dst_change_password' ||
              screen === 'change_password' ||
              screen === 'mfr_password'
            ) {
              handleOpenChangePasswordModal();
              return;
            }
            if (
              screen === 'profile' ||
              screen === 'dst_profile' ||
              screen === 'mfr_profile' ||
              screen === 'user_profile'
            ) {
              handleOpenProfileModal();
              return;
            }
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenProfileModal={handleOpenProfileModal}
          onOpenChangePasswordModal={handleOpenChangePasswordModal}
          onLogout={() => {
            setIsLoggedIn(false);
            showToast('Signed Out', 'You have securely signed out of PlastoShip.', 'info');
          }}
          onOpenMobile={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          pendingTotal={pendingTotal}
        />

        {/* Dynamic Screen View Content */}
        <main className="flex-1 w-full px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {/* MANUFACTURER PANEL SCREENS */}
          {userRole === 'manufacturer' && (
            <>
              {(currentScreen === 'mfr_dashboard' || currentScreen === 'dashboard') && (
                <MfrDashboardScreen
                  profile={mfrProfile}
                  products={products}
                  rfqs={rfqs}
                  orders={orders}
                  inventory={mfrInventory}
                  quotations={mfrQuotations}
                  settlements={mfrSettlements}
                  activities={mfrActivities}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenQuoteModal={(rfq) => {
                    setActiveQuoteRfq(rfq);
                    setCurrentScreen('mfr_rfqs');
                  }}
                />
              )}

              {currentScreen === 'mfr_profile' && (
                <MfrProfileScreen
                  profile={mfrProfile}
                  onUpdateProfile={handleUpdateMfrProfile}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'mfr_kyc' && (
                <MfrKycScreen
                  kycDocs={mfrKycDocs}
                  onUploadDoc={handleUploadMfrKycDoc}
                />
              )}

              {currentScreen === 'mfr_products' && (
                <MfrProductsScreen
                  products={products}
                  manufacturerId={mfrProfile.id}
                  manufacturerName={mfrProfile.companyName}
                  onAddProduct={handleAddMfrProduct}
                  onUpdateProduct={handleUpdateMfrProduct}
                  onDeleteProduct={handleDeleteMfrProduct}
                />
              )}

              {currentScreen === 'mfr_orders' && (
                <MfrOrdersScreen
                  orders={orders}
                  manufacturerName={mfrProfile.companyName}
                  onUpdateOrderStatus={handleMfrUpdateOrderStatus}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'mfr_rfqs' && (
                <MfrOrdersScreen
                  orders={orders}
                  manufacturerName={mfrProfile.companyName}
                  onUpdateOrderStatus={handleMfrUpdateOrderStatus}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'mfr_inventory' && (
                <MfrInventoryScreen
                  inventory={mfrInventory}
                  onAddStock={handleAddMfrStock}
                  onUpdateStock={handleUpdateMfrStock}
                />
              )}

              {currentScreen === 'mfr_subscriptions' && (
                <MfrSubscriptionScreen
                  profile={mfrProfile}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'mfr_payments' && (
                <MfrPaymentsScreen
                  settlements={mfrSettlements}
                  profile={mfrProfile}
                />
              )}

              {currentScreen === 'mfr_settings' && (
                <MfrSettingsScreen
                  profile={mfrProfile}
                  onUpdateProfile={handleUpdateMfrProfile}
                />
              )}
            </>
          )}

          {/* DISTRIBUTOR PANEL SCREENS */}
          {userRole === 'distributor' && (
            <>
              {(currentScreen === 'dst_dashboard' ||
                currentScreen === 'dashboard' ||
                !['dst_profile', 'dst_catalog', 'dst_rfqs', 'dst_quotations', 'dst_orders', 'dst_tracking', 'dst_payments', 'dst_subscription', 'dst_kyc', 'dst_settings', 'products', 'catalog', 'rfqs', 'orders', 'payments', 'kyc', 'settings'].includes(currentScreen)) && (
                <DistributorDashboardScreen
                  profile={dstProfile}
                  rfqs={rfqs}
                  orders={orders}
                  products={products}
                  quotations={mfrQuotations}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenNewRfq={() => {
                    setInitialOpenRfqModal(true);
                    setCurrentScreen('dst_rfqs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {(currentScreen === 'dst_profile' || currentScreen === 'profile') && (
                <DistributorProfileScreen
                  profile={dstProfile}
                  onUpdateProfile={handleUpdateDstProfile}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {(currentScreen === 'dst_catalog' || currentScreen === 'products' || currentScreen === 'catalog') && (
                <DistributorCatalogScreen
                  products={products}
                  categories={categories}
                  addresses={dstAddresses}
                  onInstantOrder={handleInstantDstOrder}
                  onPlaceOrder={handleInstantDstOrder}
                  onRequestRfq={() => {
                    setInitialOpenRfqModal(true);
                    setCurrentScreen('dst_rfqs');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {(currentScreen === 'dst_rfqs' || currentScreen === 'rfqs' || currentScreen === 'dst_quotations') && (
                <DistributorRfqScreen
                  rfqs={rfqs}
                  quotations={mfrQuotations}
                  categories={categories}
                  initialOpenCreateModal={initialOpenRfqModal}
                  activeInitialNewRfqModal={initialOpenRfqModal}
                  onCloseCreateModal={() => setInitialOpenRfqModal(false)}
                  onCreateRfq={handleCreateDstRfq}
                  onAcceptQuote={handleAcceptQuote}
                  onDeclineQuote={handleDeclineQuote}
                  onNegotiateQuote={handleNegotiateQuote}
                  onNavigateToOrders={() => {
                    setCurrentScreen('dst_orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {(currentScreen === 'dst_orders' || currentScreen === 'orders' || currentScreen === 'dst_tracking') && (
                <DistributorOrdersScreen
                  orders={orders}
                  onConfirmDelivery={handleConfirmDelivery}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'dst_subscription' && (
                <DistributorSubscriptionScreen
                  profile={dstProfile}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {(currentScreen === 'dst_payments' || currentScreen === 'payments') && (
                <DistributorPaymentsScreen
                  escrowPayments={dstEscrowPayments}
                  profile={dstProfile}
                  onDepositEscrow={handleDepositEscrow}
                />
              )}

              {(currentScreen === 'dst_kyc' || currentScreen === 'kyc') && (
                <DistributorKycScreen
                  profile={dstProfile}
                  kycDocs={dstKycDocs}
                  onUpdateProfile={handleUpdateDstProfile}
                  onUploadDoc={handleUploadDstKycDoc}
                />
              )}

              {(currentScreen === 'dst_password' || currentScreen === 'dst_change_password' || currentScreen === 'change_password') && (
                <DistributorChangePasswordScreen onShowToast={showToast} />
              )}

              {(currentScreen === 'dst_settings' || currentScreen === 'settings') && (
                <DistributorSettingsScreen
                  profile={dstProfile}
                  addresses={dstAddresses}
                  onAddAddress={handleAddDstAddress}
                  onDeleteAddress={handleDeleteDstAddress}
                  onSetDefaultAddress={handleSetDefaultDstAddress}
                />
              )}
            </>
          )}

          {/* SUPER ADMIN PANEL SCREENS */}
          {userRole === 'super_admin' && (
            <>
              {currentScreen === 'dashboard' && (
                <DashboardScreen
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  manufacturers={manufacturers}
                  distributors={distributors}
                  products={products}
                  rfqs={rfqs}
                  orders={orders}
                  subscriptions={subscriptionRecords}
                  recentActivities={recentActivities}
                />
              )}

              {currentScreen === 'manufacturers' && (
                <ManufacturerScreen
                  manufacturers={manufacturers}
                  categories={categories}
                  onApprove={handleApproveManufacturer}
                  onReject={handleRejectManufacturer}
                  onToggleSuspend={handleToggleSuspendManufacturer}
                  onUpdateCategories={handleUpdateManufacturerCategories}
                />
              )}

              {currentScreen === 'distributors' && (
                <DistributorScreen
                  distributors={distributors}
                  onApprove={handleApproveDistributor}
                  onReject={handleRejectDistributor}
                  onToggleSuspend={handleToggleSuspendDistributor}
                />
              )}

              {currentScreen === 'products' && (
                <ProductScreen
                  products={products}
                  onApprove={handleApproveProduct}
                  onReject={handleRejectProduct}
                  onUpdateProduct={handleUpdateProduct}
                />
              )}

              {currentScreen === 'categories' && (
                <CategoryScreen
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onToggleStatus={handleToggleCategoryStatus}
                />
              )}

              {currentScreen === 'rfqs' && <RfqScreen rfqs={rfqs} />}

              {currentScreen === 'orders' && (
                <OrderScreen orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
              )}

              {currentScreen === 'subscriptions' && (
                <SubscriptionScreen
                  plans={subscriptionPlans}
                  records={subscriptionRecords}
                  onCreatePlan={handleCreatePlan}
                  onEditPlan={handleEditPlan}
                  onTogglePlanStatus={handleTogglePlanStatus}
                />
              )}

              {currentScreen === 'invoices' && (
                <InvoiceScreen invoices={invoices} onShowToast={showToast} />
              )}

              {currentScreen === 'payments' && (
                <PaymentScreen
                  payments={payments}
                  onNavigate={(screen) => {
                    setCurrentScreen(screen);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'cms' && (
                <CmsScreen
                  banners={cmsBanners}
                  announcements={cmsAnnouncements}
                  featuredItems={cmsFeatured}
                  onToggleBanner={handleToggleBanner}
                  onToggleAnnouncement={handleToggleAnnouncement}
                  onToggleFeatured={handleToggleFeatured}
                  onAddAnnouncement={handleAddAnnouncement}
                  onAddBanner={handleAddBanner}
                />
              )}

              {currentScreen === 'reports' && (
                <ReportsScreen
                  manufacturers={manufacturers}
                  distributors={distributors}
                  products={products}
                  orders={orders}
                  rfqs={rfqs}
                />
              )}

              {currentScreen === 'settings' && (
                <SettingsScreen onShowToast={(t, d) => showToast(t, d, 'success')} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Role-Specific Profile Pop-up Modals */}
      <ManufacturerProfileModal
        isOpen={isMfrProfileModalOpen}
        onClose={() => setIsMfrProfileModalOpen(false)}
        profile={mfrProfile}
        onUpdateProfile={handleUpdateMfrProfile}
        onShowToast={showToast}
      />

      <DistributorProfileModal
        isOpen={isDstProfileModalOpen}
        onClose={() => setIsDstProfileModalOpen(false)}
        profile={dstProfile}
        onUpdateProfile={handleUpdateDstProfile}
        onShowToast={showToast}
      />

      <AdminProfileModal
        isOpen={isAdminProfileModalOpen}
        onClose={() => setIsAdminProfileModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Universal Change Password Pop-up Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        userRole={userRole}
        userEmail={
          userRole === 'manufacturer'
            ? mfrProfile.email
            : userRole === 'distributor'
            ? dstProfile.email
            : 'admin@plastoship.com'
        }
        onShowToast={showToast}
      />

      {/* Floating System Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
