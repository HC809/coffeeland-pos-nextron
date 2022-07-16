import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";
import { fadeInBottomWithScaleX } from "@/lib/framer-motion/fade-in-bottom";
import { IProduct } from "../../models/IProduct";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { addProductToNewOrder } from "@/store/newOrderSlice";
import usePrice from "@/lib/hooks/use-price";
import toast from "react-hot-toast";
import { selectNewOrder } from "../../store/newOrderSlice";

export default function ProductCard({ product }: { product: IProduct }) {
  const { name, image, sellingPrice } = product ?? {};

  const dispatch = useAppDispatch();

  const { newOrderDetail } = useAppSelector(selectNewOrder);

  const { price: itemPrice } = usePrice({
    amount: sellingPrice,
  });

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.05 }}
      variants={fadeInBottomWithScaleX()}
      onClick={() => {
        const existProductInOrder = newOrderDetail.find(
          (p) => p.productId === product.id
        );

        if (existProductInOrder) {
          return toast.error("El producto ya existe en la orden.", {
            duration: 1000,
          });
        }

        dispatch(
          addProductToNewOrder({
            productId: product.id,
            productName: product.name,
            image: product.image,
            categoryId: product.categoryId || 0,
            categoryName: product.category || "",
            taxId: product.taxRateId || 0,
            taxPercentage: product.taxPercentage,
            taxName: product.taxRate || "",
            sellingPrice: product.sellingPrice || 0,
            priceBeforeTax: product.priceBeforeTax || 0,
            quantity: 1,
            discount: 0,
            discountPercentage: 0,
            taxAmount: product.sellingPrice - product.priceBeforeTax,
            subtotal: product.priceBeforeTax,
            total: product.sellingPrice,
          })
        );

        toast.success(<b>Producto agregado al pedido!</b>, {
          duration: 500,
        });
      }}
      className="group bg-light dark:bg-dark-250 cursor-pointer rounded-md px-4 py-7 text-center"
    >
      <div className="relative mx-auto mb-2.5 h-[75px] w-[75px] md:h-20 md:w-20 lg:h-[90px] lg:w-[90px]">
        {image ? (
          <Image
            alt={name}
            layout="fill"
            quality={100}
            objectFit="cover"
            src={`data:image/jpeg;base64,${image}`}
            className="rounded-3xl"
          />
        ) : (
          <img
            width="100px"
            height="100px"
            className="ml-auto mr-auto"
            src="/images/new.png"
          />
        )}
      </div>
      <h3 className="font-base  text-dark group-hover:text-brand dark:text-light mb-1 text-lg transition-colors">
        {name}
      </h3>
      <div className="text-sm font-medium text-green-700">{itemPrice}</div>
    </motion.div>
  );
}
