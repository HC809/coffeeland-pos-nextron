import React from "react";
import { useState } from "react";
import Button from "@/components/ui/button";
import Scrollbar from "@/components/ui/scrollbar";
import CartItemList from "@/components/cart/cart-item-list";
import CartEmpty from "@/components/cart/cart-empty";
import usePrice from "@/lib/hooks/use-price";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder } from "@/store/newOrderSlice";

import { NewOrderStartButton } from "../new-order/new-order-start";
import { useModalAction } from "../modal-views/context";

function CartDrawerView() {
  const { openModal } = useModalAction();

  const { newOrderInfo, newOrderAmounts, newOrderDetail } =
    useAppSelector(selectNewOrder);

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
            onClick={() => openModal("END_NEW_ORDER_VIEW")}
            className="w-full text-sm md:h-[52px]"
          >
            Pagar
          </Button>
        </div>
      </div>
    </>
  );
}

export default CartDrawerView;
