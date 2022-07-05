import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { cancelNewOrder } from "@/store/newOrderSlice";
import { useModalAction } from "../modal-views/context";

export default function NewOrderInvoiceDetail() {
  const { closeModal } = useModalAction();

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Factura #
            </h1>
          </div>
          <>
            <Button
              type="button"
              onClick={closeModal}
              variant="solidDanger"
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
            >
              Cerrar
            </Button>
          </>
        </div>
      </div>
    </div>
  );
}
