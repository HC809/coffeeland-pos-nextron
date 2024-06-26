import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useModalAction } from "../modal-views/context";
import { selectGeneralInfo, setPrinterName } from "@/store/generalInfoSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
const { ipcRenderer } = window.require("electron");

export interface IFormValues {
  printerName: string;
}

export default function PrinterConfigView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { printerName } = useAppSelector(selectGeneralInfo);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setLoading(null as any);
    };
  }, []);

  const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
    printerName: yup.string().required("Campo requerido."),
  });

  const initialValues: IFormValues = {
    printerName: printerName || "",
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

  const onSubmit = async ({ printerName }: IFormValues) => {
    await dispatch(setPrinterName(printerName));
    closeModal();
    return toast.success("Impresora actualizada.", { duration: 500 });
  };

  const printTest = async () => {
    setLoading(true);
    try {
      const response = await ipcRenderer.invoke("print-test", {
        printerName: getValues("printerName"),
      });
      console.log(response);
      if (!response.success) {
        return toast.error(response.message, {
          position: "top-center",
          duration: 5000,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-2 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Configurar Impresora
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <br></br>
              <Input
                label="Nombre de la Impresora"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("printerName")}
                error={errors.printerName?.message}
              />

              <Button
                type="button"
                onClick={async () => await printTest()}
                variant="text"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              >
                {`${loading ? "Imprimiendo..." : "Prueba de Impresión"}`}
              </Button>

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
