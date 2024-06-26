import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { setNewOrderType, selectNewOrder } from "@/store/newOrderSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import { selectGeneralInfo } from "../../store/generalInfoSlice";
import Image from "@/components/ui/image";
import placeholder from "@/assets/images/placeholders/product.svg";

export interface IFormValues {
  customerName?: string | null | undefined;
  rtn: string | null | undefined;
}

const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
  customerName: yup
    .string()
    .transform((curr, orig) => (orig === "" ? "Consumidor Final" : curr)),
  rtn: yup
    .string()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .nullable(true)
    .notRequired(),
});

export default function StartNewOrderForm() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();
  const { newOrderInfo } = useAppSelector(selectNewOrder);
  const { orderTypes } = useAppSelector(selectGeneralInfo);

  const [orderTypeCode, setOrderTypeCode] = useState<string>(
    newOrderInfo.orderTypeCode
  );

  useEffect(() => {
    return () => {
      setOrderTypeCode(null as any);
    };
  }, []);

  const initialValues: IFormValues = {
    customerName: newOrderInfo.started
      ? newOrderInfo.customerName
      : "Consumidor Final",
    rtn: newOrderInfo.started ? newOrderInfo.rtn : null,
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({ customerName, rtn }: IFormValues) => {
    await dispatch(
      setNewOrderType({
        customerName: customerName || "Consumidor Final",
        orderTypeCode: orderTypeCode!,
        rtn: rtn || "",
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
              Editar Orden
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <div className="grid h-full grid-cols-3 gap-5 pt-5">
                {orderTypes.map((item) => {
                  return (
                    <div
                      key={item.code}
                      onClick={() => {
                        setOrderTypeCode(item.code);
                      }}
                      className={`${
                        orderTypeCode !== item.code
                          ? "group bg-light dark:bg-dark-250 cursor-pointer rounded-md px-4 py-7 text-center focus:border-2 focus:border-green-600"
                          : "group bg-light dark:bg-dark-250 border-brand cursor-pointer rounded-md border-2 px-4 py-7 text-center"
                      }`}
                    >
                      <div className="relative mx-auto mb-2.5 h-[75px] w-[75px] md:h-20 md:w-20 lg:h-[90px] lg:w-[90px]">
                        <Image
                          alt={item.code}
                          layout="fill"
                          quality={100}
                          objectFit="cover"
                          src={
                            item.image
                              ? `data:image/jpeg;base64,${item.image}`
                              : placeholder
                          }
                          className="rounded-3xl"
                        />
                      </div>
                      <h3
                        className={`${
                          orderTypeCode !== item.code
                            ? "font-base group-hover:text-brand dark:text-light mb-1 text-gray-300 transition-colors"
                            : "font-base text-brand mb-1 text-lg"
                        }`}
                      >
                        {item.name}
                      </h3>
                    </div>
                  );
                })}
              </div>

              <br></br>

              <Input
                label="Cliente"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("customerName")}
                error={errors.customerName?.message}
              />
              <Input
                label="RTN"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("rtn")}
                error={errors.rtn?.message}
              />

              <Button
                type="submit"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                disabled={!orderTypeCode}
              >
                {newOrderInfo.started ? "Guardar" : "Iniciar"}
              </Button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
