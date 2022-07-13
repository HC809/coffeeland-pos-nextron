export interface IInvoice {
    id: number;
    orderTypeCode: string;
    invoiceNumber: number;
    invoicePointNumber: number;
    documentTypeNumber: number;
    establishmentNumber: number;
    cai: string;
    range: string;  
    limitDate: Date;
    orderNumber: string;
    customerName: string;
    rtn: string;
    reference: string;
    date: Date;
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
    cashAmount: number;
    cardAmount: number;
    changeAmount: number;
    username: string;
    detail: IInvoiceDetail[];
}

export interface IInvoiceDetail {
    id: number;
    invoiceHeaderId: number;
    productId: number;
    productName: string;
    taxId: number;
    taxName: string;
    taxAmount: number;
    discount: number;
    discountPercentage: number;
    sellingPrice: number;
    priceBeforeTax: number;
    quantity: number;
    subtotal: number;
    total: number;
}
