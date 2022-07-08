import usePrice from "@/lib/hooks/use-price";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";
import { IOrderDetail } from "../../models/INewOrder";
import Counter from "../ui/counter";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useAppSelector } from "../../hooks/reduxHooks";
import {
  decrementProductQuantityFromNewOrder,
  incremenetProductQuantityFromNewOrder,
} from "@/store/newOrderSlice";
import { AiFillEdit } from "react-icons/ai";

export default function CartItem({
  item,
  notAvailable,
}: {
  item: IOrderDetail;
  notAvailable?: boolean;
}) {
  const { productName, productId, image } = item;

  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.newOrder.newOrderDetail.find((prod) => prod.productId === productId)
  );

  const { price: itemPrice } = usePrice({
    amount: product?.sellingPrice || 0,
  });

  const { price: total } = usePrice({
    amount: product?.total || 0,
  });

  const incremenetProductQuantity = () => {
    dispatch(incremenetProductQuantityFromNewOrder(product!));
  };

  const decrementProductQuantity = () => {
    dispatch(decrementProductQuantityFromNewOrder(product!));
  };

  return (
    <div className="flex w-full items-start gap-4 py-3">
      <div>
        <Counter
          value={product?.quantity || 0}
          onDecrement={decrementProductQuantity}
          onIncrement={incremenetProductQuantity}
        />
      </div>
      <div className="border-light-300 bg-light-300 dark:bg-dark-500 xs:w-32 relative aspect-[5/3.7] w-28 flex-shrink-0 border dark:border-0">
        <Image
          alt={productName}
          layout="fill"
          src={image ? `data:image/jpeg;base64,${image}` : placeholder}
          objectFit="contain"
        />
      </div>
      <div className="text-13px w-[calc(100%-50px)] font-medium ">
        <span className="mb-1 inline-block rounded-2xl text-xs font-semibold text-green-800">
          {productName}
        </span>

        <div className="flex w-full items-start gap-4 py-1">
          <div>
            <p className="pt-3">
              <span className="bg-light-300 text-brand-dark dark:bg-dark-500 rounded-2xl p-1.5 font-semibold uppercase leading-none">
                {total}
              </span>
            </p>
            <p className="flex items-center gap-1 pt-3">
              <span className="bg-light-300 dark:bg-dark-500 rounded-2xl p-1.5 font-semibold uppercase leading-none">
                {itemPrice}
              </span>
              <span className="text-light-base dark:text-dark-base">
                X {product?.quantity || 0}
              </span>
            </p>
          </div>

          <div className="text-13px pt-3 font-medium">
            <button
              type="button"
              className="text-dark-900 top-1/2 p-2 font-medium hover:text-green-600"
              onClick={() => {}}
            >
              <AiFillEdit size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
