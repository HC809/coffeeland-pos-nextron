export interface IOrder {
  started: boolean;
  finished: boolean;
  orderTypeCode: string;
  invoicePointId: number;
  establishmentNumber: number,
  documentTypeNumber: number,
  invoicePointNumber: number,
  cai: string;
  invoiceRangeId: number;
  invoiceNumber: number;
  limitDate: Date | null;
  range: string;
  ticketNumber: number | null;
  customerName: string;
  rtn: string | null;
  date: Date | null;
  cashAmount: number;
  cardAmount: number;
  reference: string;
  changeAmount: number;
  orderNumber: string;
  cancelled: boolean;
  cancelledDate?: Date | null;
  cancelledReason?: string;

  isSync: boolean;
}

export interface IOrderAmounts {
  subtotal: number;
  totalDiscount: number;
  totalTax15: number;
  totalTax18: number;
  totalExempt: number;
  totalExonerated: number;
  taxableAmountDiscount: number;
  taxableAmount15: number;
  taxableAmount18: number;
  totalTax: number;
  total: number;
}

export interface IOrderDetail {
  productId: number;
  productName: string;
  image?: string;
  categoryId: number;
  categoryName: string;
  taxId: number;
  taxPercentage: number;
  taxName: string;
  sellingPrice: number;
  priceBeforeTax: number;
  quantity: number;
  discountPercentage: number;
  discount: number;
  taxAmount: number;
  subtotal: number;
  total: number;

  comment?: string;
}

export interface IOrderDetailSummary {
  productName: string;
  sellingPrice: number;
  priceBeforeTax: number;
  quantity: number;
  taxAmount: number;
  subtotal: number;
  total: number;
}

export interface IOrderKitchenSummary {
  productName: string;
  quantity: number;
  comment: string;
}
