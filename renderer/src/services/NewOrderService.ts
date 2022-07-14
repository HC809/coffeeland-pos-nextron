import { IOrderAmounts, IOrderDetail } from "@/models/INewOrder";

export const calculateTotalOrderAmounts = (
    newOrderDetail: IOrderDetail[]
): IOrderAmounts => {
    let amounts = {
        subtotal: 0.0,
        totalTax: 0.0,
        total: 0.0,
    };

    let totalDiscount = 0;
    newOrderDetail
        .filter((item) => item.discountPercentage !== 0)
        .map((x: IOrderDetail) => {
            totalDiscount = (totalDiscount + x.discount);
        });

    let totalExemptTax = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'Exento')
        .map((x: IOrderDetail) => {
            totalExemptTax = totalExemptTax + (x.sellingPrice * x.quantity);
        });

    let totalExoneratedTax = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'Exonerado')
        .map((x: IOrderDetail) => {
            totalExoneratedTax = totalExoneratedTax + (x.sellingPrice * x.quantity);
        });

    let totalTax15 = 0;
    let taxableAmount15 = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'ISV 15%')
        .map((x: IOrderDetail) => {
            totalTax15 = (totalTax15 + x.taxAmount);
            taxableAmount15 = taxableAmount15 + (x.discountPercentage === 0
                ? x.sellingPrice * x.quantity
                : x.priceBeforeTax * x.quantity);
        });

    let totalTax18 = 0;
    let taxableAmount18 = 0;
    newOrderDetail
        .filter((item) => item.taxName === 'ISV 18%')
        .map((x: IOrderDetail) => {
            totalTax18 = (totalTax18 + x.taxAmount);
            taxableAmount18 = taxableAmount18 + (x.discountPercentage === 0
                ? x.sellingPrice * x.quantity
                : x.priceBeforeTax * x.quantity);
        });

    newOrderDetail.map((item: IOrderDetail) => {
        amounts.subtotal += item.subtotal;
        amounts.totalTax += item.taxAmount;
        amounts.total += item.total;
    });

    return {
        subtotal: amounts.subtotal,
        totalDiscount: totalDiscount,
        totalTax15: totalTax15,
        totalTax18: totalTax18,
        totalExempt: totalExemptTax,
        totalExonerated: totalExoneratedTax,
        taxableAmount15: taxableAmount15,
        taxableAmount18: taxableAmount18,
        taxableAmountDiscount: 0,
        totalTax: amounts.totalTax,
        total: amounts.total,
    };
};

export const incremenetProductQuantity = (product: IOrderDetail) => {
    let newQuantity = product.quantity + 1;

    const { discountPercentage, taxPercentage, sellingPrice, priceBeforeTax } = product;

    const subtotal = priceBeforeTax * newQuantity;
    const discount = discountPercentage === 0 ? 0 : subtotal * (discountPercentage / 100);
    const tax = discountPercentage !== 0
        ? ((subtotal - discount) * (taxPercentage || 0)) / 100
        : (sellingPrice - priceBeforeTax) * newQuantity;

    let updatedProduct: IOrderDetail = {
        ...product,
        quantity: newQuantity,
        subtotal: subtotal,
        discount: discount,
        taxAmount: tax,
        total: discountPercentage === 0 ? newQuantity * sellingPrice : subtotal - discount + tax,
    };

    return updatedProduct;
};

export const decrementProductQuantity = (product: IOrderDetail) => {
    let newQuantity = product.quantity - 1;

    const { discountPercentage, taxPercentage, sellingPrice, priceBeforeTax } = product;

    const subtotal = priceBeforeTax * newQuantity;
    const discount = discountPercentage === 0 ? 0 : subtotal * (discountPercentage / 100);
    const tax = discountPercentage !== 0
        ? ((subtotal - discount) * (taxPercentage || 0)) / 100
        : (sellingPrice - priceBeforeTax) * newQuantity;

    let updatedProduct: IOrderDetail = {
        ...product,
        quantity: newQuantity,
        subtotal: subtotal,
        discount: discount,
        taxAmount: tax,
        total: discountPercentage === 0 ? newQuantity * sellingPrice : subtotal - discount + tax,
    };

    return updatedProduct;
};