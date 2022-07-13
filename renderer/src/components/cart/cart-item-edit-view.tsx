import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { selectNewOrder, selectItemToEditImage } from "@/store/newOrderSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";
import Textarea from "../ui/forms/textarea";

export interface IFormValues {
  discountPercentage?: number;
  comment?: string;
}

const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
  discountPercentage: yup
    .number()
    .transform((curr, orig) => (orig === "" ? 0 : curr))
    .min(0, "El porcentaje de descuento no puede ser menor a 0.")
    .notRequired(),
  comment: yup.string().transform((curr, orig) => (orig === "" ? "" : curr)),
});

export default function CartEditItemView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();
  const { newOrderEditItem } = useAppSelector(selectNewOrder);
  const image = useAppSelector(selectItemToEditImage);

  useEffect(() => {
    return () => {};
  }, []);

  const initialValues: IFormValues = {
    discountPercentage: newOrderEditItem?.discountPercentage || 0,
    comment: newOrderEditItem?.comment || "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({ discountPercentage, comment }: IFormValues) => {
    closeModal();
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[480px]">
          <div className="pb-2 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Editar Item
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <div className="grid h-full grid-cols-3 gap-5 pt-5">
                <div className="relative mx-auto mb-2.5 h-[75px] w-[75px] md:h-20 md:w-20 lg:h-[90px] lg:w-[90px]">
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
                </div>
                <h3>{newOrderEditItem?.productName}</h3>
              </div>

              <br></br>

              <Input
                label="Porcentaje de Descuento (%)"
                type="number"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("discountPercentage")}
                error={errors.discountPercentage?.message}
              />

              <Textarea
                label="Comentario (opcional)"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("comment")}
                error={errors.comment?.message}
              />

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
