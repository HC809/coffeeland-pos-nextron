import { IOrderAmounts, IOrderDetail } from "@/models/INewOrder";

export const calculateTotalOrderAmounts = (
    newOrderDetail: IOrderDetail[]
): IOrderAmounts => {
    let amounts = {
        subtotal: 0.0,
        totalTax: 0.0,
        total: 0.0,
    };

    let totalExemptTax = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'Exento')
        .map((x: IOrderDetail) => {
            totalExemptTax = totalExemptTax + x.sellingPrice;
        });

    let totalExoneratedTax = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'Exonerado')
        .map((x: IOrderDetail) => {
            totalExoneratedTax = totalExoneratedTax + x.sellingPrice;
        });

    let totalTax15 = 0;
    let taxableAmount15 = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'ISV 15%')
        .map((x: IOrderDetail) => {
            totalTax15 = (totalTax15 + x.taxAmount) * x.quantity;
            taxableAmount15 = (taxableAmount15 + x.sellingPrice) * x.quantity;
        });

    let totalTax18 = 0;
    let taxableAmount18 = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'ISV 18%')
        .map((x: IOrderDetail) => {
            totalTax18 = (totalTax18 + x.taxAmount) * x.quantity;
            taxableAmount18 = (taxableAmount18 + x.sellingPrice) * x.quantity;
        });

    newOrderDetail.map((item: IOrderDetail) => {
        amounts.subtotal += item.subtotal;
        amounts.totalTax += item.taxAmount;
        amounts.total += item.total;
    });

    return {
        subtotal: amounts.subtotal,
        totalTax15: totalTax15,
        totalTax18: totalTax18,
        totalExempt: totalExemptTax,
        totalExonerated: totalExoneratedTax,
        taxableAmount15: taxableAmount15,
        taxableAmount18: taxableAmount18,
        totalTax: amounts.totalTax,
        total: amounts.total,
    };
};

export const incremenetProductQuantity = (product: IOrderDetail) => {
    let newQuantity = product.quantity + 1;

    let updatedProduct: IOrderDetail = {
        ...product,
        quantity: newQuantity,
        subtotal: newQuantity * product.priceBeforeTax,
        taxAmount: product.sellingPrice - product.priceBeforeTax,
        total: newQuantity * product.sellingPrice,
    };

    return updatedProduct;
};

export const decrementProductQuantity = (product: IOrderDetail) => {
    let newQuantity = product.quantity - 1;

    let updatedProduct: IOrderDetail = {
        ...product,
        quantity: newQuantity,
        subtotal: newQuantity * product.priceBeforeTax,
        taxAmount: product.sellingPrice - product.priceBeforeTax,
        total: newQuantity * product.sellingPrice,
    };

    return updatedProduct;
};