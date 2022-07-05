import React from "react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Scrollbar from "@/components/ui/scrollbar";
import CartItemList from "@/components/cart/cart-item-list";
import CartEmpty from "@/components/cart/cart-empty";
import usePrice from "@/lib/hooks/use-price";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectNewOrder,
  selectNewOrderDetailForInvoice,
} from "@/store/newOrderSlice";
import { selectGeneralInfo } from "../../store/generalInfoSlice";
import {
  formatNumber,
  hourFormat,
  formatInvoice,
} from "../../helpers/functions/general";
import { toShortDate } from "../../helpers/functions/general";
import { NumeroALetras } from "@/helpers/functions/lettersAmount";
import { NewOrderStartButton } from "../new-order/new-order-start";
// const { ipcRenderer } = window.require('electron');

interface InvoicePrintResponse {
  success: boolean;
  error: string;
  message: string;
}

function CartDrawerView() {
  const dispatch = useAppDispatch();

  const { newOrderInfo, newOrderAmounts, newOrderDetail } =
    useAppSelector(selectNewOrder);

  const newOrderDetailForInvoce = useAppSelector(
    selectNewOrderDetailForInvoice
  );

  const { companyInfo } = useAppSelector(selectGeneralInfo);

  useEffect(() => {
    return () => {};
  }, []);

  const {
    total,
    subtotal,
    totalExempt,
    totalExonerated,
    totalTax15,
    totalTax18,
    taxableAmount15,
    taxableAmount18,
    totalTax,
  } = newOrderAmounts;

  const [loading, setLoading] = useState(false);

  const { price: totalAmount } = usePrice({
    amount: total,
  });

  const { price: subtotalAmount } = usePrice({
    amount: subtotal,
  });

  const handleCheckout = async () => {
    const invoiceDate = new Date();
    setLoading(true);

    const productDetails = [...newOrderDetailForInvoce];

    const detail = productDetails.map((item) => {
      return {
        quantity: item.quantity,
        price: formatNumber(item.sellingPrice),
        total: formatNumber(item.total),
      };
    });

    const orderModel = {
      invoiceDate: toShortDate(invoiceDate),
      invoiceHour: hourFormat(invoiceDate),
      invoiceNumber: formatInvoice(
        newOrderInfo.establishmentNumber,
        newOrderInfo.documentTypeNumber,
        newOrderInfo.invoicePointNumber,
        newOrderInfo.invoiceNumber
      ),
      limitDate: toShortDate(newOrderInfo.limitDate!),
      range: newOrderInfo.range,
      companyInfo,
      newOrderInfo,
      newOrderAmountList: {
        subtotal: formatNumber(newOrderAmounts.subtotal),
        totalTax15: formatNumber(newOrderAmounts.totalTax15),
        totalTax18: formatNumber(newOrderAmounts.totalTax18),
        totalExempt: formatNumber(newOrderAmounts.totalExempt),
        totalExonerated: formatNumber(newOrderAmounts.totalExonerated),
        totalTax: formatNumber(newOrderAmounts.totalTax),
        taxableAmount15: formatNumber(newOrderAmounts.taxableAmount15),
        taxableAmount18: formatNumber(newOrderAmounts.taxableAmount18),
        total: formatNumber(newOrderAmounts.total),
      },
      lettersAmount: NumeroALetras(newOrderAmounts.total),
      newOrderProductDetail: detail,
    };

    console.log(orderModel);

    // const invoicePrintResponse: InvoicePrintResponse = await ipcRenderer.invoke(
    //   'print-invoice',
    //   {
    //     invoiceDate: toShortDate(invoiceDate),
    //     invoiceHour: hourFormat(invoiceDate),
    //     invoiceNumber: `${formatLeadingZeros(0, 3)}-${formatLeadingZeros(
    //       1,
    //       3
    //     )}-${formatLeadingZeros(1, 3)}-${formatLeadingZeros(
    //       newOrderInfo?.invoiceNumber,
    //       8
    //     )}`,
    //     companyInfo,
    //     newOrderInfo,
    //     newOrderAmountList: {
    //       subtotal: formatNumber(newOrderAmounts.subtotal),
    //       totalTax15: formatNumber(newOrderAmounts.totalTax15),
    //       totalTax18: formatNumber(newOrderAmounts.totalTax18),
    //       totalExempt: formatNumber(newOrderAmounts.totalExempt),
    //       totalExonerated: formatNumber(newOrderAmounts.totalExonerated),
    //       totalTax: formatNumber(newOrderAmounts.totalTax),
    //       taxableAmount15: formatNumber(newOrderAmounts.taxableAmount15),
    //       taxableAmount18: formatNumber(newOrderAmounts.taxableAmount18),
    //       total: formatNumber(newOrderAmounts.total),
    //     },
    //     lettersAmount: NumeroALetras(newOrderAmounts.total),
    //     newOrderProductDetail: newOrderDetailForInvoce,
    //   }
    // );

    setLoading(false);

    // if (invoicePrintResponse.success) {
    //   //alert(1);
    // } else {
    //   toast.error(invoicePrintResponse.error, {
    //     position: 'bottom-center',
    //     duration: 5000,
    //   });
    // }
  };

  return (
    <>
      <div className="flex h-[70px] items-center justify-between py-2 px-5 sm:px-7">
        <h2 className="text-dark dark:text-light text-sm font-medium capitalize">
          Pedido
        </h2>
      </div>
      {newOrderInfo.started ? (
        <Scrollbar className="cart-scrollbar w-full flex-1 py-6 px-6 sm:px-7">
          {newOrderDetail.length > 0 ? <CartItemList /> : <CartEmpty />}
        </Scrollbar>
      ) : (
        <Scrollbar className="cart-scrollbar w-full flex-1 py-6 px-6 sm:px-7">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mt-5 md:mt-8">
              <NewOrderStartButton />
            </div>
          </div>
        </Scrollbar>
      )}

      <div className="border-light-300 dark:border-dark-500 border-t px-5 py-6 sm:px-7 sm:pb-8 sm:pt-7">
        <div className="text-dark text-dark-800 dark:text-light flex justify-between pb-1 text-sm font-medium">
          <span>Subtotal:</span>
          <span>{subtotalAmount}</span>
        </div>
        {/* <div className="flex justify-between pb-1 text-sm font-medium text-dark text-dark-800 dark:text-light">
          <span>Importe Exento:</span>
          <span>{totalExemptAmount}</span>
        </div>
        <div className="flex justify-between pb-1 text-sm font-medium text-dark text-dark-800 dark:text-light">
          <span>Importe Exonerado:</span>
          <span>{totalExoneratedAmount}</span>
        </div>
        <div className="flex justify-between pb-1 text-sm font-medium text-dark text-dark-800 dark:text-light">
          <span>Importe Gravado 15%:</span>
          <span>{totalTax15Amount}</span>
        </div>
        <div className="flex justify-between pb-1 text-sm font-medium text-dark text-dark-800 dark:text-light">
          <span>Importe Gravado 18%:</span>
          <span>{totalTax18Amount}</span>
        </div>
        <div className="flex justify-between pb-1 text-sm font-medium text-dark text-dark-800 dark:text-light">
          <span>Total Impuesto:</span>
          <span>{totalTaxAmount}</span>
        </div> */}
        <div className="text-dark dark:text-light flex justify-between text-sm font-medium">
          <span>Total:</span>
          <span>{totalAmount}</span>
        </div>
        <div className="mt-3 md:mt-5">
          <Button
            disabled={newOrderDetail.length === 0 || loading}
            isLoading={loading}
            onClick={() => handleCheckout()}
            className="w-full text-sm md:h-[52px]"
          >
            {!loading ? "Facturar" : "Imprimiendo Factura..."}
          </Button>
        </div>
      </div>
    </>
  );
}

export default CartDrawerView;
