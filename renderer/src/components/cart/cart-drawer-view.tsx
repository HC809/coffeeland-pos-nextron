import React from "react";
import Scrollbar from "@/components/ui/scrollbar";
import CartItemList from "@/components/cart/cart-item-list";
import CartEmpty from "@/components/cart/cart-empty";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder } from "@/store/newOrderSlice";

function CartDrawerView() {
  const { newOrderInfo, newOrderDetail } = useAppSelector(selectNewOrder);

  return (
    <>
      <div className="flex h-[50px] items-center justify-between px-7 ">
        <h1 className="text-dark dark:text-light text-base font-medium capitalize">
          {`Orden Nº ${newOrderInfo.orderNumber}`}
        </h1>
      </div>
      <Scrollbar className="cart-scrollbar w-full flex-1 py-6 px-6 sm:px-7">
        {newOrderDetail.length > 0 ? <CartItemList /> : <CartEmpty />}
      </Scrollbar>
    </>
  );
}

export default CartDrawerView;
