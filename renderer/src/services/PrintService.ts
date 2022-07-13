const { ipcRenderer } = window.require("electron");
import { formatInvoice, formatNumber, hourFormat, toShortDate } from "@/helpers/functions/general";
import { NumeroALetras } from "@/helpers/functions/lettersAmount";
import { IGeneralInfo } from "@/models/IGeneralInfo";
import { IOrder, IOrderAmounts, IOrderDetailSummary, IOrderKitchenSummary } from '../models/INewOrder';

export const printInvoice = async (
    printerName: string,
    newOrderInfo: IOrder,
    newOrderAmounts: IOrderAmounts,
    productDetails: IOrderDetailSummary[],
    companyInfo: IGeneralInfo,
    invoiceDate: Date,
    cashAmount: number,
    cardAmount: number,
    changeAmount: number,
    copy: boolean,) => {

    const detail = productDetails.map((item) => {
        return {
            productName: item.productName,
            quantity: item.quantity,
            price: `L ${formatNumber(item.sellingPrice)}`,
            total: `L ${formatNumber(item.total)}`,
        };
    });

    const orderModel = {
        printerName: printerName,
        cash: `L ${(cashAmount)
            ? formatNumber((cashAmount))
            : "0"
            }`,
        card: `L ${(cardAmount)
            ? formatNumber((cardAmount))
            : "0"
            }`,
        change: `L ${changeAmount ? formatNumber(changeAmount) : "0"}`,
        invoiceDate: `FECHA: ${toShortDate(invoiceDate)}  / HORA: ${hourFormat(
            invoiceDate
        )}`,
        invoiceHour: hourFormat(invoiceDate),
        invoiceNumber: formatInvoice(
            newOrderInfo.establishmentNumber,
            newOrderInfo.documentTypeNumber,
            newOrderInfo.invoicePointNumber,
            newOrderInfo.invoiceNumber
        ),
        limitDate: toShortDate(newOrderInfo.limitDate!),
        companyInfo,
        newOrderInfo,
        newOrderAmountList: {
            subtotal: formatNumber(newOrderAmounts.subtotal),
            totalDiscount: formatNumber(newOrderAmounts.totalDiscount),
            totalTax15: formatNumber(newOrderAmounts.totalTax15),
            totalTax18: formatNumber(newOrderAmounts.totalTax18),
            totalExempt: formatNumber(newOrderAmounts.totalExempt),
            totalExonerated: formatNumber(newOrderAmounts.totalExonerated),
            taxableAmount15: formatNumber(newOrderAmounts.taxableAmount15),
            taxableAmount18: formatNumber(newOrderAmounts.taxableAmount18),
            taxableAmountDiscount: formatNumber(newOrderAmounts.taxableAmountDiscount),
            totalTax: formatNumber(newOrderAmounts.totalTax),
            total: formatNumber(newOrderAmounts.total),
        },
        lettersAmount: NumeroALetras(newOrderAmounts.total),
        newOrderProductDetail: detail,
        copy: copy ? "Copia" : "",
    };

    await ipcRenderer.invoke("print-invoice", orderModel);
};

export const printTicket = async (printerName: string, orderNumber: string, date: Date, orderType: string, detail: IOrderKitchenSummary[]) => {
    const model = {
        printerName,
        orderNumber,
        orderType,
        invoiceDate: `FECHA: ${toShortDate(date)}  / HORA: ${hourFormat(
            date
        )}`,
        detail,
    }

    await ipcRenderer.invoke("print-kitchen-ticket", model);
}