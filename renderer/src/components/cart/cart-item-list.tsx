import cn from "classnames";
import toast from "react-hot-toast";
import { CloseIcon } from "@/components/icons/close-icon";
import CartItem from "@/components/cart/cart-item";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  removeProductFromNewOrder,
  selectNewOrder,
} from "@/store/newOrderSlice";

export default function CartItemList({ className }: { className?: string }) {
  const dispatch = useAppDispatch();

  const { newOrderDetail } = useAppSelector(selectNewOrder);

  function handleClearItemFromCart(productId: number) {
    dispatch(removeProductFromNewOrder(productId));
    return toast.success(<b>Producto removido del pedido!</b>, { duration: 1000 });
  }
  return (
    <ul role="list" className={cn("-my-6 w-full", className)}>
      {newOrderDetail.map((item) => {
        return (
          <li
            key={item.productId}
            className="border-light-300 dark:border-dark-500 xs:ml-6 relative ml-4 flex border-b last-of-type:border-b-0"
          >
            <button
              type="button"
              className="text-dark-900 hover:text-dark dark:text-dark-800 dark:hover:text-light-900 xs:-left-10 absolute -left-8 top-1/2 -mt-3.5 flex-shrink-0 p-2 font-medium"
              onClick={() => handleClearItemFromCart(item.productId)}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
            <CartItem item={item} notAvailable={!!false} />
          </li>
        );
      })}
    </ul>
  );
}
