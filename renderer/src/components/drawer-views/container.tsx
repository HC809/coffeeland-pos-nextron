import dynamic from "next/dynamic";

const CartDrawerView = dynamic(
  () => {
    return import("@/components/cart/cart-drawer-view");
  },
  { ssr: false }
);

export default function DrawersContainer() {
  return (
    <div className="">
      <CartDrawerView />
    </div>
  );
}
