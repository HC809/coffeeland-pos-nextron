import dynamic from "next/dynamic";

const CartDrawerView = dynamic(
  () => {
    return import("@/components/cart/cart-drawer-view");
  },
  { ssr: false }
);

export default function DrawersContainer() {
  return (
    <div className="bg-light w-2/5">
      <div className="flex h-full flex-col">
        <CartDrawerView />
      </div>
    </div>
  );
}
