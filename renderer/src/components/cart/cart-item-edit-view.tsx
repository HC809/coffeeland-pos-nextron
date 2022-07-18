import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  selectNewOrder,
  selectItemToEditImage,
  applyDiscountToItem,
  setCommentToItem,
} from "@/store/newOrderSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";
import Textarea from "../ui/forms/textarea";
import { AiOutlinePercentage } from "react-icons/ai";
import { CgComment } from "react-icons/cg";
import { formatNumber } from "@/helpers/functions/general";
import { BsImage } from "react-icons/bs";

export interface IFormValues {
  discountPercentage?: number;
  quantityToDiscount?: number;
  comment?: string;
}

export default function CartEditItemView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();
  const { newOrderEditItem } = useAppSelector(selectNewOrder);
  const image = useAppSelector(selectItemToEditImage);

  const [totalDiscount, setTotalDisount] = useState<number>(
    newOrderEditItem?.discount || 0
  );
  const [totalTax, setTotalTax] = useState<number>(
    newOrderEditItem?.taxAmount || 0
  );
  const [total, setTotal] = useState<number>(newOrderEditItem?.total || 0);

  useEffect(() => {
    return () => {
      setTotalDisount(null as any);
      setTotalTax(null as any);
      setTotal(null as any);
    };
  }, []);

  const setDiscount = (discountPercentage: number, quantity: number) => {
    if (
      discountPercentage !== 0 &&
      quantity !== 0 &&
      quantity <= newOrderEditItem?.quantity!
    ) {
      const prodSubtotal = newOrderEditItem?.subtotal || 0;

      const prodSellingPrince = newOrderEditItem?.sellingPrice || 0;
      const prodPriceBeforeTax = newOrderEditItem?.priceBeforeTax || 0;
      const prodTaxPercentage = newOrderEditItem?.taxPercentage || 0;

      const discount =
        (discountPercentage / 100) * (prodPriceBeforeTax * quantity);
      console.log(discount);

      const tax =
        discountPercentage !== 0
          ? (prodSubtotal - discount) * (prodTaxPercentage / 100)
          : (prodSellingPrince - prodPriceBeforeTax) * quantity;

      setTotalDisount(discount);
      setTotalTax(tax);
      setTotal(
        discountPercentage !== 0
          ? prodSubtotal - discount + tax
          : quantity * prodSellingPrince
      );
    }
  };

  const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
    discountPercentage: yup
      .number()
      .transform((curr, orig) => (orig === "" ? 0 : curr))
      .min(0, "El porcentaje de descuento no puede ser menor a 0.")
      .notRequired(),
    quantityToDiscount: yup
      .number()
      .transform((curr, orig) => (orig === "" ? 0 : curr))
      .max(
        newOrderEditItem?.quantity || 1,
        "La cantidad no puede ser mayor a la cantidad del producto."
      )
      .when("discountPercentage", {
        is: (discountPercentage: number) => discountPercentage > 0,
        then: yup
          .number()
          .min(1, "La cantidad no puede ser 0.")
          .max(
            newOrderEditItem?.quantity!,
            "La cantidad no puede ser mayor a la cantidad del producto."
          )
          .required("La cantidad de productos es requqerida."),
      })
      .notRequired(),
    comment: yup.string().transform((curr, orig) => (orig === "" ? "" : curr)),
  });

  const initialValues: IFormValues = {
    discountPercentage: newOrderEditItem?.discountPercentage || 0,
    quantityToDiscount:
      newOrderEditItem && newOrderEditItem?.quantityToDiscount > 1
        ? newOrderEditItem.quantityToDiscount
        : 1,
    comment: newOrderEditItem?.comment || "",
  };

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({
    discountPercentage,
    quantityToDiscount,
    comment,
  }: IFormValues) => {
    await dispatch(
      applyDiscountToItem({
        productId: newOrderEditItem?.productId!,
        discountPercentage: discountPercentage || 0,
        quantityToDiscount: quantityToDiscount || 0,
        discount: totalDiscount,
        taxAmount: totalTax,
        total: total,
      })
    );

    dispatch(
      setCommentToItem({
        productId: newOrderEditItem?.productId!,
        comment: comment || "",
      })
    );

    closeModal();
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[480px]">
          <div className="pb-2 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              {`${newOrderEditItem?.productName} X ${newOrderEditItem?.quantity}`}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <div className="grid h-full grid-cols-2 gap-2 pt-10 pr-12">
                <div className="relative mx-auto mb-2.5 h-[75px]  md:h-20  lg:h-[90px] lg:w-[90px]">
                  {image ? (
                    <Image
                      alt={newOrderEditItem?.productName}
                      layout="fill"
                      quality={100}
                      objectFit="cover"
                      src={
                        image ? `data:image/jpeg;base64,${image}` : placeholder
                      }
                      className="rounded-3xl"
                    />
                  ) : (
                    <div className="pl-2">
                      <BsImage size={85} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-dark">
                    <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                      <span>Subtotal</span>
                      <span>{`L ${formatNumber(
                        newOrderEditItem?.subtotal || 0
                      )}`}</span>
                    </div>
                  </div>
                  <div className="text-dark">
                    <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                      <span>Descuento</span>
                      <span>{`L ${formatNumber(totalDiscount)}`}</span>
                    </div>
                  </div>
                  <div className="text-dark">
                    <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                      <span>Impuesto</span>
                      <span>{`L ${formatNumber(totalTax)}`}</span>
                    </div>
                  </div>
                  <div className="text-dark">
                    <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                      <span>Total</span>
                      <span>{`L ${formatNumber(total)}`}</span>
                    </div>
                  </div>
                </div>
              </div>

              <br></br>

              <div className="grid h-full grid-cols-8 pt-2">
                <div className="pt-5">
                  <AiOutlinePercentage size={35} color="#0D9965" />
                </div>
                <div className="col-span-6">
                  <Input
                    label="Porcentaje de Descuento"
                    type="number"
                    inputClassName="bg-light dark:bg-dark-300"
                    {...register("discountPercentage")}
                    onChange={(e) =>
                      setDiscount(
                        Number(e.target.value),
                        Number(getValues("quantityToDiscount"))
                      )
                    }
                    error={errors.discountPercentage?.message}
                  />
                </div>
              </div>

              {newOrderEditItem && newOrderEditItem?.quantity > 1 && (
                <div className="grid h-full grid-cols-8 pt-2">
                  <div className="pt-5"></div>
                  <div className="col-span-6">
                    <Input
                      label="Cantidad de Productos a Aplicar Descuento"
                      type="number"
                      inputClassName="bg-light dark:bg-dark-300"
                      {...register("quantityToDiscount")}
                      onChange={(e) =>
                        setDiscount(
                          Number(getValues("discountPercentage")),
                          Number(e.target.value)
                        )
                      }
                      error={errors.quantityToDiscount?.message}
                    />
                  </div>
                </div>
              )}

              <div className="grid h-full grid-cols-8 pt-5">
                <div className="pt-5">
                  <CgComment size={35} color="#0D9965" />
                </div>
                <div className="col-span-6">
                  <Textarea
                    label="Comentario (opcional)"
                    inputClassName="bg-light dark:bg-dark-300"
                    {...register("comment")}
                    error={errors.comment?.message}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              >
                Guardar
              </Button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
