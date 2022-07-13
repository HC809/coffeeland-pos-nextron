import { ISale } from '../models/ISale';
import { IInvoice, IInvoiceDetail } from '../models/IInvoice';
import { IOrderDetail, IOrder } from '../models/INewOrder';


export const getInvoicesModel = (sales: ISale[], username: string): IInvoice[] => {
    const invoices: IInvoice[] = sales.map((sale) => {
        return {
            id: 0,
            orderTypeCode: sale.orderInfo.orderTypeCode,
            invoiceNumber: sale.orderInfo.invoiceNumber,
            invoicePointNumber: sale.orderInfo.invoicePointNumber,
            documentTypeNumber: sale.orderInfo.documentTypeNumber,
            establishmentNumber: sale.orderInfo.establishmentNumber,
            cai: sale.orderInfo.cai,
            range: sale.orderInfo.range,
            limitDate: sale.orderInfo.limitDate!,
            orderNumber: sale.orderInfo.orderNumber,
            customerName: sale.orderInfo.customerName,
            rtn: sale.orderInfo.rtn || "",
            reference: sale.orderInfo.reference,
            date: sale.orderInfo.date!,
            subtotal: sale.orderAmounts.subtotal,
            totalDiscount: sale.orderAmounts.totalDiscount,
            totalTax15: sale.orderAmounts.totalTax15,
            totalTax18: sale.orderAmounts.totalTax18,
            totalExempt: sale.orderAmounts.totalExempt,
            totalExonerated: sale.orderAmounts.totalExonerated,
            taxableAmountDiscount: sale.orderAmounts.taxableAmountDiscount,
            taxableAmount15: sale.orderAmounts.taxableAmount15,
            taxableAmount18: sale.orderAmounts.taxableAmount18,
            totalTax: sale.orderAmounts.totalTax,
            total: sale.orderAmounts.total,
            cashAmount: sale.orderInfo.cashAmount,
            cardAmount: sale.orderInfo.cardAmount,
            changeAmount: sale.orderInfo.changeAmount,
            username: username,
            invoicePointId: sale.orderInfo.invoicePointId,
            invoiceRangeId: sale.orderInfo.invoiceRangeId,
            detail: getInvoiceDetail(sale.orderDetail)
        }
    });

    return invoices;
}

const getInvoiceDetail = (details: IOrderDetail[]): IInvoiceDetail[] => {
    const invoiceDetails: IInvoiceDetail[] = details.map((detail) => {
        return {
            id: 0,
            invoiceHeaderId: 0,
            productId: detail.productId,
            productName: detail.productName,
            taxId: detail.taxId,
            taxName: detail.taxName,
            taxAmount: detail.taxAmount,
            discount: detail.discount,
            discountPercentage: detail.discountPercentage,
            sellingPrice: detail.sellingPrice,
            priceBeforeTax: detail.priceBeforeTax,
            quantity: detail.quantity,
            subtotal: detail.subtotal,
            total: detail.total,
        }
    });

    return invoiceDetails;
}